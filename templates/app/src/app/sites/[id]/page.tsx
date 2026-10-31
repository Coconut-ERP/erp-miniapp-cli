import { DetailPage } from "@/components/page/detail-page";

type Props = { params: Promise<{ id: string }> };

export default async function SiteDetailPage({ params }: Props) {
  const { id } = await params;
  return <DetailPage siteId={id} />;
}
