import {
  Address,
  BASE_FEE,
  Contract,
  TransactionBuilder,
  nativeToScVal,
  rpc,
} from "@stellar/stellar-sdk";
import { requestAccess, signTransaction } from "@stellar/freighter-api";
import { CONTRACT_ID } from "../config";

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";

async function randomProofHash(): Promise<Uint8Array> {
  // Demo only: a random unique hash, because the proof step is still simulated.
  const seed = crypto.getRandomValues(new Uint8Array(32));
  const digest = await crypto.subtle.digest("SHA-256", seed);
  return new Uint8Array(digest);
}

export async function submitVerification(params: {
  minAge: number;
  allowedCountry: number;
  proofValid: boolean;
}): Promise<{ hash: string; address: string }> {
  const access = await requestAccess();
  if (access.error || !access.address) throw new Error("Wallet connection was declined");
  const address = access.address;

  const server = new rpc.Server(RPC_URL);
  const account = await server.getAccount(address);
  const contract = new Contract(CONTRACT_ID);

  const tx = new TransactionBuilder(account, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      contract.call(
        "verify_kyc",
        new Address(address).toScVal(),
        nativeToScVal(params.minAge, { type: "u64" }),
        nativeToScVal(params.allowedCountry, { type: "u64" }),
        nativeToScVal(await randomProofHash(), { type: "bytes" }),
        nativeToScVal(params.proofValid, { type: "bool" }),
      ),
    )
    .setTimeout(300)
    .build();

  const prepared = await server.prepareTransaction(tx);
  const signed = await signTransaction(prepared.toXDR(), {
    networkPassphrase: NETWORK_PASSPHRASE,
    address,
  });
  if (signed.error || !signed.signedTxXdr) throw new Error("Transaction was not signed");

  const signedTx = TransactionBuilder.fromXDR(signed.signedTxXdr, NETWORK_PASSPHRASE);
  const sent = await server.sendTransaction(signedTx);
  if (sent.status === "ERROR") {
    let code = "unknown";
    try {
      code = sent.errorResult?.result().switch().name ?? "unknown";
    } catch {}
    throw new Error("Network rejected the transaction: " + code);
  }

  for (let i = 0; i < 20; i++) {
    const res = await server.getTransaction(sent.hash);
    if (res.status === "SUCCESS") return { hash: sent.hash, address };
    if (res.status === "FAILED") throw new Error("Contract call failed on-chain");
    await new Promise((r) => setTimeout(r, 1500));
  }
  throw new Error("Timed out waiting for confirmation");
}