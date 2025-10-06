import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getProductBySlug } from "@/lib/content";

import DesignerEditor from "./DesignerEditor";
import DesignUpsell from "./DesignUpsell";
import DesignStaffBlock from "./DesignStaffBlock";

export default async function DesignPage({ params }: { params: { style: string } }) {
  const user = await getCurrentUser();
  const product = getProductBySlug(params.style);

  if (!product) {
    notFound();
  }

  if (!user) {
    return <DesignUpsell product={product} user={null} />;
  }

  if (user.is_staff) {
    return <DesignStaffBlock product={product} user={user} />;
  }

  return <DesignerEditor product={product} canManageOptions={Boolean(user.is_staff)} />;
}
