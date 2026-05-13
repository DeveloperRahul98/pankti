import { SharedPlateView } from "@/components/plate/shared-plate-view";

export const dynamic = "force-static";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <SharedPlateView token={token} />;
}
