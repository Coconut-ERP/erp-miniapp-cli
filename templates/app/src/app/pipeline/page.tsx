import { redirect } from "next/navigation";

/** @deprecated Use `/table` — Pipeline was renamed to Table (CRUD demo). */
export default function PipelineRedirect() {
  redirect("/table");
}
