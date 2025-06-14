import { getRecommendedAds } from "@/api/ads";
import { fetchCategory } from "@/api/categories";
import { CategoryListSection } from "@/c/Categories";
import { seo } from "@/c/funcs";
import { HomepageLayout } from "@/c/Layout";
import MoreAds from "@/c/Widget/MoreAds";

export const metadata = seo("/", {
  title: "Aham: Bazarul tău preferat",
  description:
    "Începe explorarea în bazarul tău preferat unde găsești și cunoști o grămadă de lucruri.",
  icons: {
    apple: "favicons/favicon-180x180.png",
  },
  manifest: "aham.webmanifest",
  other: {
    "msapplication-TileColor": "#1F70B8",
    "msapplication-TileImage": "favicons/favicon-180x180.png",
  },
});

export default async function Home() {
  return (
    <HomepageLayout>
      <CategoryListSection category={await fetchCategory(1)} />
      <CategoryListSection category={await fetchCategory(2)} />
      <MoreAds title="Recomandate" ads={await getRecommendedAds(0)} />
    </HomepageLayout>
  );
}
