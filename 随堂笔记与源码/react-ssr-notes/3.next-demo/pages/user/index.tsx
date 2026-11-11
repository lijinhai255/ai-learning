// import Link from "next/link";
// import {
//   QueryClient,
//   QueryClientProvider,
//   useQuery,
// } from "@tanstack/react-query";

// const client = new QueryClient();

// const UserDetailPage = () => {
//   const { data, isLoading } = useQuery({
//     queryKey: ["user-list"],
//     queryFn: async () => {
//       const res = (await fetch("/api/hello")).json();
//       return res;
//     },
//   });
//   console.log("🚀 ~ UserDetailPage ~ data:", data);
//   return (
//     <div>
//       User
//       {isLoading && "loading..."}
//       <ul>
//         {data?.map((item) => {
//           return (
//             <li key={item.id}>
//               <Link href={`/user/${item.id}`}>{item.name}</Link>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// };

// export default function User() {
//   return (
//     <QueryClientProvider client={client}>
//       <UserDetailPage />
//     </QueryClientProvider>
//   );
// }
import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";

type Users = {
  users: {
    id: number;
    name: string;
  }[];
};

export const getServerSideProps = (async (context) => {
  const baseUrl = "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/hello`);
  console.log("🚀 ~ getStaticProps ~ res:", res);
  const users = await res.json();
  return { props: { users } };
}) satisfies GetStaticProps<{
  users: Users;
}>;

export default function User({
  users,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  return (
    <div>
      User
      <ul>
        {users?.map((item) => {
          return (
            <li key={item.id}>
              <Link href={`/user/${item.id}`}>{item.name}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
