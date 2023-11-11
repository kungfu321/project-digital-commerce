import PageHeader from "@/components/admin/page-header";
import UserTable from "@/components/admin/user/user-table";
import { getUsers } from "@/lib/getDataSVOnly";

const UsersPage = async ({
  searchParams,
}: {
  searchParams: { skip: string, take: string }
}) => {
  const { data: users, pagination } = await getUsers({ ...searchParams });

  return (
    <div>
      <PageHeader title="User List" />

      <UserTable
        data={users}
        pagination={pagination}
        className="mt-8" />
    </div>
  )
}

export default UsersPage;
