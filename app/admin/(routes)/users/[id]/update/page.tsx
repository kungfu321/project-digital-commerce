import PageHeader from "@/components/admin/page-header";
import { getUser } from "@/lib/getDataSVOnly";
import UpdateUserForm from "@/components/admin/user/update-user-form";

const UpdateUserPage = async ({ params }: { params: { id: string } }) => {
  const { data: user } = await getUser({ id: params.id });
  
  if (!user) {
    throw Error;
  }
  
  return (
    <div>
      <PageHeader title="Update a user" />
      <UpdateUserForm
        data={user}
      />
    </div>
  )
}

export default UpdateUserPage;
