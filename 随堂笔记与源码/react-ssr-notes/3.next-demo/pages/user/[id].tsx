import { useRouter } from "next/router";

export default function UserDetailPage() {
  const router = useRouter();

  console.log(router.route, router.query);

  const { id } = router.query;

  return <div>user detail page ---- {id}</div>;
}
