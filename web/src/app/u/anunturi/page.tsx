"use client";

import { getDraftAds } from "@/api/ads";
import { PageName } from "@/c/Layout";
import { AccountLayoutContext } from "@/c/Layout/account";
import { Ad } from "@/c/types";
import AdListItemDraft from "@/c/Widget/AdListItemDraft";
import Loading from "@/c/Widget/Loading";
import NoResults from "@/c/Widget/NoResults";
import { Add } from "@mui/icons-material";
import { Button, IconButton } from "@mui/joy";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";

export default function Page() {
  const [ads, setAds] = useState<Ad[] | null>(null);
  const { setPath } = useContext(AccountLayoutContext);
  useEffect(() => {
    setPath(
      <>
        <span>Anunțuri</span>
        <span>Ciorne</span>
        <Link href="/u/anunturi/creaza">
          <IconButton size="sm">
            <Add />
          </IconButton>
        </Link>
      </>
    );
  }, []);

  useEffect(() => {
    getDraftAds().then(setAds);
  }, []);

  const onRemoveAd = () => {
    getDraftAds().then(setAds);
  };

  if (ads == null) {
    return <Loading />;
  }

  if (ads != null && ads.length === 0) {
    return (
      <NoResults
        after={
          <Link href="/u/anunturi/creaza">
            <Button>Adaugă anunț</Button>
          </Link>
        }
      />
    );
  }

  return (
    <>
      <PageName>Ciorne</PageName>
      {ads?.map((ad, index) => (
        <AdListItemDraft onRemove={onRemoveAd} key={index} ad={ad} />
      ))}
    </>
  );
}
