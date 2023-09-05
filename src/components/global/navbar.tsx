import { db } from "@/src/lib/drizzle";
import { notifications } from "@/src/lib/drizzle/schema";
import { userSchema } from "@/src/lib/validation/user";
import { DefaultProps } from "@/src/types";
import { Notification } from "@/src/types/notification";
import { currentUser } from "@clerk/nextjs";
import { and, desc, eq } from "drizzle-orm";
import HomeNavbar from "./home-navbar";
import NavbarItems from "./navbar-items";

async function Navbar({ className }: DefaultProps) {
    const user = await currentUser();
    if (!user) return <HomeNavbar />;

    const data = (await db.query.notifications.findMany({
        where: and(
            eq(notifications.userId, user.id),
            eq(notifications.read, false)
        ),
        orderBy: [desc(notifications.createdAt)],
    })) as Notification[];

    const userData = userSchema.parse(user);

    return <NavbarItems user={userData} notifications={data} />;
}

export default Navbar;
