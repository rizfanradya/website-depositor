"use client";
import Link from "next/link";
import { VscError } from "react-icons/vsc";

export default function ErrorBankAlreadyExist() {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Bank Already Exist</title>

      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <VscError size={100} className="text-error" />
          <h1 className="text-4xl font-semibold">Error Add New Bank</h1>
          <p className="py-4 text-2xl">Bank Already Exist</p>
          <Link
            href={"/listBankManagement"}
            className="btn btn-primary text-white text-lg"
          >
            OK
          </Link>
        </div>
      </div>
    </div>
  );
}
