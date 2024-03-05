"use client";
import Link from "next/link";
import { FaRegCheckCircle } from "react-icons/fa";

export default function AddDepositoSuccess() {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-4">
      <title>Add Deposito Success</title>

      <div className="card bg-white shadow-xl text-slate-600 w-full max-w-md py-6">
        <div className="card-body flex flex-col items-center justify-center gap-4 py-4">
          <FaRegCheckCircle size={100} className="text-success" />
          <h1 className="text-4xl font-semibold">Congratulations</h1>
          <p className="py-4 text-2xl">Add Deposito Success</p>
          <Link href={"/"} className="btn btn-primary text-white text-lg">
            OK
          </Link>
        </div>
      </div>
    </div>
  );
}
