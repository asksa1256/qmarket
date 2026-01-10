import AdminDirectPriceForm from "@/features/admin/ui/AdminDirectPriceForm";

export default async function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">관리자 페이지</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold mb-6">시세 등록</h2>
        <AdminDirectPriceForm />
      </div>
    </div>
  );
}
