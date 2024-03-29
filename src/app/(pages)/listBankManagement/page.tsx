import MainLayout from "@/app/components/mainLayout";
import prisma from "@/utils/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import DeleteBank from "./delete";
import ButtonForm from "@/app/components/button";
import { IoIosSend } from "react-icons/io";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";

export default async function ListBankManagement() {
  const session: any = await getServerSession();
  if (!session) {
    redirect("/login");
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.name },
  });
  if (user?.role === "user") {
    redirect("/");
  }
  const bankList = await prisma.bank.findMany();

  async function onSubmit(formData: FormData) {
    "use server";
    const bank: any = formData.get("bank");
    const formatText = bank.toLowerCase();
    async function handleSubmit() {
      try {
        const response = await prisma.bank.create({
          data: { bank: formatText },
        });
        return { message: "ok", response };
      } catch (error) {
        return { message: "error", error };
      }
    }

    const result = await handleSubmit();
    if (result.message === "ok") {
      revalidatePath("/listBankManagement");
    } else {
      redirect("/errorBankAlreadyExist");
    }
  }

  return (
    <MainLayout>
      <title>HeGame - Bank Management</title>
      <div className="max-w-md m-auto">
        <Link
          href={"/paymentMethod"}
          className="btn btn-sm btn-error text-white"
        >
          <FaArrowLeft size={20} />
        </Link>

        <form className="flex gap-2 mt-4" action={onSubmit}>
          <input
            className="input input-bordered w-full"
            required
            placeholder="New Bank"
            name="bank"
          />
          <ButtonForm icon={<IoIosSend size={20} />} text="Add" />
        </form>

        <div className="overflow-x-auto mt-4 rounded-xl">
          <table className="table text-center">
            <thead className="bg-info text-white">
              <tr>
                <th>No</th>
                <th>Bank</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {bankList.map((doc, index) => (
                <tr className="uppercase" key={index}>
                  <td>{index + 1}</td>
                  <td>{doc.bank}</td>
                  <td>
                    <DeleteBank doc={doc} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
