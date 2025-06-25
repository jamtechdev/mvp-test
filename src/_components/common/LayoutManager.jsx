import AppLayout from "./AppLayout";
import AuthLayout from './AuthLayout'; // Correct casing

export default function LayoutManager({ children, includeAuthLayout = false }) {
  return (
    <>
      {!includeAuthLayout && <AppLayout>{children}</AppLayout>}
      {includeAuthLayout && <AuthLayout>{children}</AuthLayout>}
    </>
  );
}
