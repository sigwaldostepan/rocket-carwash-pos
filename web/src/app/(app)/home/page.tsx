import { AuthGuard } from "@/components/guards";
import { PageShell } from "@/components/layouts";

const HomePage = () => {
  return (
    <AuthGuard>
      <PageShell title="Beranda">
        <h1>hai</h1>
      </PageShell>
    </AuthGuard>
  );
};

export default HomePage;
