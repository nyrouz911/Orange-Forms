import FormClient from "@/app/form-generator/FormClient"

export default function Page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Orange Forms</h1>
      <FormClient />
    </div>
  );
}