import type { Metadata } from "next";
import { MyList } from "@/components/MyList";

export const metadata: Metadata = { title: "My list" };

export default function MyListPage() {
  return (
    <section className="section pt-12">
      <div className="container">
        <span className="eyebrow">My list</span>
        <h1 className="h-page mt-4">Saved for later</h1>
        <p className="lede mt-4">
          Your list is kept in this browser on this device. A later version will let you sign in with your DigiBlu
          account so your list and progress follow you.
        </p>
        <div className="mt-10">
          <MyList />
        </div>
      </div>
    </section>
  );
}
