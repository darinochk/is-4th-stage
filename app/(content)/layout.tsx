import Header from "@/app/components/header";
import Starter from "@/app/components/starter";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
      <Starter />
    </>
  );
}
