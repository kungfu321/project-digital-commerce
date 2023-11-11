import ProfileForm from "@/components/shop/user/profile/profile-form";
import { getUserInfo } from "@/lib/getDataSVOnly";

const ProfilePage = async () => {
  const { data: userInfo } = await getUserInfo();

  return (
    <div className="space-y-4">
      <ProfileForm data={userInfo} />
    </div>
  )
}

export default ProfilePage;
