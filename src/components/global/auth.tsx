import { db } from "@/src/lib/drizzle";
import { users } from "@/src/lib/drizzle/schema";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import DropdownProfile from "./dropdown-profile";
import LoginButton from "./login-button";

async function Auth() {
    const supabase = createServerComponentClient({ cookies });
    const {
        data: { session },
        error,
    } = await supabase.auth.getSession();

    if (error || !session)
        return <LoginButton className="flex items-center gap-2 px-4" />;

    const dbUser = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    });
    if (!dbUser)
        return (
            <LoginButton className="flex items-center gap-2 px-4 hover:bg-zinc-800" />
        );

    return <DropdownProfile user={dbUser} />;
}

export default Auth;
