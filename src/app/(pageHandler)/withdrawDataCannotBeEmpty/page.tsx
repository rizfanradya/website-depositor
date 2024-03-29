import Link from "next/link";
import { VscError } from "react-icons/vsc";

export default function WithdrawDataCannotBeEmpty() {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Data Cannot Be Empty</title>

      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <VscError size={100} className="text-error" />
          <h1 className="text-4xl font-semibold">Error</h1>
          <p className="py-4 text-2xl">Data Cannot Be Empty</p>
          <Link
            href={"/withdraw"}
            className="btn btn-primary text-white text-lg"
          >
            OK
          </Link>
        </div>
      </div>
    </div>
  );
}
