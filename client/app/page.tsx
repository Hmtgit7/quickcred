import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

/** Root route — always redirect to login (middleware handles auth'd users) */
export default function HomePage() {
  redirect(ROUTES.LOGIN);
}
