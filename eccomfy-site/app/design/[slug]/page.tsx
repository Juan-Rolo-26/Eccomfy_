import { notFound } from "next/navigation";

import { getCurrentUser } from "@/lib/auth";
import { getProductStyleBySlug } from "@/lib/content";

import DesignerEditor from "./DesignerEditor";
import DesignUpsell from "./DesignUpsell";
import DesignStaffBlock from "./DesignStaffBlock";

export default async function DesignPage({ params }: { params: { slug: string } }) {
  const product = getProductStyleBySlug(params.slug);
  if (!product) {
    notFound();
  }

  const user = await getCurrentUser();

  if (!user) {
    return <DesignUpsell product={product} user={null} />;
  }

  if (user.is_staff) {
    return <DesignStaffBlock product={product} user={user} />;
  }

  return <DesignerEditor product={product} />;
}
