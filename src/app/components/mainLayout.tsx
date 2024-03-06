import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { FaUserCircle } from "react-icons/fa";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="flex items-center justify-between bg-info py-3 px-4 md:px-8 fixed w-full z-10 border-b-8 border-base-100">
        <Link href={"/"} className="font-semibold text-2xl text-base-100">
          DEPOSITOR
        </Link>

        <Link href={"/account"} className="text-base-100">
          <FaUserCircle size={35} />
        </Link>
      </div>

      <div className="px-2 py-20">{children}</div>
    </>
  );
}
