import Navbar from "@/myComponents/Navbar";

export default function Home() {
  return (
    <>
      <div className="flex flex-col h-screen px-8 gap-4">
        <div className="pt-4">
          <Navbar />
        </div>
      </div>
    </>
  );
}
