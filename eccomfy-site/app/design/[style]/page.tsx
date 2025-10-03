import { getCurrentUser } from "@/lib/auth";
import { getAllDesignOptions } from "@/lib/designOptions";

import DesignerEditor from "./DesignerEditor";
import DesignUpsell from "./DesignUpsell";
import DesignStaffBlock from "./DesignStaffBlock";

export default async function DesignPage({ params }: { params: { style: string } }) {
  const user = await getCurrentUser();

  if (!user) {
    return <DesignUpsell style={params.style} user={null} />;
  }

  if (user.is_staff) {
    return <DesignStaffBlock style={params.style} user={user} />;
  }

  const options = getAllDesignOptions();

  return <DesignerEditor style={params.style} options={options} canManageOptions={Boolean(user.is_staff)} />;
}
