"use client";

import { Project } from "@/src/lib/drizzle/schema";
import { addNotification } from "@/src/lib/utils";
import {
    ProjectCreateData,
    projectCreateSchema,
    ProjectPatchData,
} from "@/src/lib/validation/project";
import { ResponseData } from "@/src/lib/validation/response";
import { NewProjectProps } from "@/src/types/notification";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";

interface PageProps {
    project?: Project;
}

function ProjectForm({ project }: PageProps) {
    const router = useRouter();

    const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<ProjectCreateData>({
        resolver: zodResolver(projectCreateSchema),
        defaultValues: {
            name: project?.name ?? "",
            description: project?.description ?? "",
            requirements: project?.requirements ?? "",
        },
    });

    const handleSubmit = () => {
        project ? handleUpdateProject() : onOpen();
    };

    const handleUpdateProject = () => {
        setIsLoading(true);

        const toastId = toast.loading("Updating Project");

        const body: ProjectPatchData = {
            name: form.getValues("name"),
            description: form.getValues("description"),
            requirements: form.getValues("requirements"),
        };

        axios
            .patch<ResponseData>(`/api/projects/${project?.id}`, body)
            .then(({ data: resData }) => {
                if (resData.code !== 204)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("Project has been updated", {
                    id: toastId,
                });

                router.push(`/projects/${project?.id}`);
            })
            .catch((err) => {
                console.error(err);

                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleCreateProject = () => {
        setIsLoading(true);

        const toastId = toast.loading("Creating Project");

        const body: ProjectCreateData = {
            name: form.getValues("name"),
            description: form.getValues("description"),
            requirements: form.getValues("requirements"),
        };

        axios
            .post<ResponseData>("/api/projects", JSON.stringify(body))
            .then(({ data: resData }) => {
                if (resData.code !== 201)
                    return toast.error(resData.message, {
                        id: toastId,
                    });

                toast.success("Project has been initiated", {
                    id: toastId,
                });

                const result = JSON.parse(resData.data) as Omit<
                    NewProjectProps,
                    "type"
                >;

                router.push(`/projects/${result.projectId}`);

                addNotification({
                    title: "New Project",
                    content: `@${result.purchaserUsername} has requested a new project`,
                    notifierId: result.purchaserId,
                    userId: result.sellerId,
                    props: {
                        type: "newProject",
                        projectId: result.projectId,
                        projectTitle: result.projectTitle,
                        purchaserId: result.purchaserId,
                        purchaserUsername: result.purchaserUsername,
                        purchaserImage: result.purchaserImage,
                        sellerId: result.sellerId,
                    },
                });
            })
            .catch((err) => {
                console.error(err);

                toast.error("Something went wrong, try again later!", {
                    id: toastId,
                });
            })
            .finally(() => {
                setIsLoading(false);
                onClose();
            });
    };

    return (
        <>
            <Form {...form}>
                <form
                    className="grid gap-5"
                    onSubmit={(...args) =>
                        form.handleSubmit(handleSubmit)(...args)
                    }
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">
                                    Project Name
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        classNames={{
                                            inputWrapper:
                                                "border border-gray-700 bg-background",
                                        }}
                                        radius="sm"
                                        placeholder="Super Cool Project"
                                        maxLength={100}
                                        disabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="relative">
                                <FormLabel className="text-lg">
                                    Project Description
                                </FormLabel>
                                <FormControl>
                                    <>
                                        <Textarea
                                            placeholder="A short description of your project"
                                            radius="sm"
                                            classNames={{
                                                inputWrapper:
                                                    "border border-gray-700 bg-background pb-8",
                                                input: "text-base",
                                            }}
                                            aria-label="Project Description"
                                            minRows={3}
                                            isDisabled={isLoading}
                                            maxLength={450}
                                            {...field}
                                        />

                                        <span className="absolute bottom-2 right-2 text-sm text-gray-400">
                                            {450 -
                                                (form.watch("description")
                                                    ?.length ?? 0)}
                                        </span>
                                    </>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-lg">
                                    Project Requirements
                                </FormLabel>
                                <FormDescription>
                                    You can use markdown expressions in this
                                    field
                                </FormDescription>
                                <FormControl>
                                    <Textarea
                                        placeholder="State the requirements for your project"
                                        radius="sm"
                                        classNames={{
                                            inputWrapper:
                                                "border border-gray-700 bg-background",
                                            input: "text-base",
                                        }}
                                        aria-label="Project Requirements"
                                        minRows={8}
                                        maxRows={400}
                                        isDisabled={isLoading}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        type="submit"
                        radius="sm"
                        color="success"
                        className="bg-primary-700 font-semibold"
                        isDisabled={
                            isLoading ||
                            !form.formState.isValid ||
                            (form.getValues("name") === project?.name &&
                                form.getValues("description") ===
                                    project?.description &&
                                form.getValues("requirements") ===
                                    project?.requirements)
                        }
                        isLoading={isLoading}
                    >
                        {project
                            ? isLoading
                                ? "Updating Project"
                                : "Update Project"
                            : isLoading
                            ? "Creating Project"
                            : "Create Project"}
                    </Button>
                </form>
            </Form>

            <Modal
                backdrop="blur"
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                size="3xl"
                scrollBehavior="inside"
                radius="sm"
            >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader>Terms and Conditions</ModalHeader>
                            <ModalBody>
                                <h2 className="text-lg font-semibold">
                                    Usage of Services
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        You may not resell any products you
                                        purchase from us.
                                    </li>
                                    <li>
                                        You may not redistribute any products
                                        you purchase from us.
                                    </li>
                                    <li>
                                        You may not claim any products you
                                        purchase from us as your own.
                                    </li>
                                    <li>
                                        You may not use any products you
                                        purchase from us for illegal purposes.
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    Technologies We Use
                                </h2>
                                <p className="text-gray-400">
                                    At DRVGO, we specialize in web development
                                    projects, specifically using Next.js (App
                                    Router) as our primary framework. We
                                    exclusively support the use of Next.js (App
                                    Router) in its latest version to ensure the
                                    best performance and functionality.
                                </p>

                                <p className="text-gray-400">
                                    Here&apos;s a list of the technologies and
                                    tools we utilize in our web development
                                    projects:
                                </p>

                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Next.js (App Router):
                                        </span>{" "}
                                        A powerful framework for building
                                        performant and SEO-friendly web
                                        applications.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            TypeScript:
                                        </span>{" "}
                                        Ensuring robust and type-safe code for
                                        enhanced development.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            React.js:
                                        </span>{" "}
                                        Creating dynamic and interactive user
                                        interfaces for seamless navigation.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            ShadCN UI:
                                        </span>{" "}
                                        A library for manipulating the UI.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Next UI:
                                        </span>{" "}
                                        Another library for manipulating the UI.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Pusher:
                                        </span>{" "}
                                        Adding real-time functionality to the
                                        application.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            React Hot Toast:
                                        </span>{" "}
                                        Adding toast notifications to the
                                        application.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Tailwind CSS:
                                        </span>{" "}
                                        Designing responsive layouts with ease
                                        and speed.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Zod:
                                        </span>{" "}
                                        Implementing strong data validation for
                                        secure user interactions.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Clerk:
                                        </span>{" "}
                                        Facilitating authentication and user
                                        management.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Tanstack Query:
                                        </span>{" "}
                                        Optimizing server-state synchronization
                                        and caching.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            T3-Env:
                                        </span>{" "}
                                        Adding type-safe environment variables.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            UploadThing:
                                        </span>{" "}
                                        Uploading and storing files and images
                                        of users.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Framer Motion:
                                        </span>{" "}
                                        Adding delightful animations to user
                                        interactions.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Drizzle:
                                        </span>{" "}
                                        TypeScript ORM for SQL.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Planetscale MySQL:
                                        </span>{" "}
                                        Primary Database to save most of the
                                        user, blogs, etc. data.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Upstash Redis:
                                        </span>{" "}
                                        Adding a ratelimiter to API routes.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Axios:
                                        </span>{" "}
                                        Manipulating data between Front-end &
                                        Back-end.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Lucide Icons:
                                        </span>{" "}
                                        Adding interesting icons.
                                    </li>
                                    <li>
                                        <span className="font-semibold text-gray-300">
                                            Zustand:
                                        </span>{" "}
                                        State management for React.
                                    </li>
                                </ul>

                                <p className="text-gray-400">
                                    Please note that hosting for your project is
                                    not provided by DRVGO. Hosting is solely
                                    your responsibility.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    Refunds
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        Refunds are only available if we are
                                        unable to complete your order or if we
                                        are unable to deliver your order within
                                        the specified time frame.
                                    </li>
                                    <li>
                                        Refunds are not available if you are
                                        banned from our services.
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    Chargebacks
                                </h2>
                                <p className="text-gray-400">
                                    Chargebacks are not allowed. If you initiate
                                    a chargeback, you will be banned from our
                                    services.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    Strikes and Cancelled Ongoing Projects
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        Canceling an ongoing project with DRVGO
                                        results in receiving a strike.
                                    </li>
                                    <li>
                                        Strikes are recorded to ensure fair and
                                        reliable service.
                                    </li>
                                    <li>
                                        For each strike, a 10% fee will be
                                        applied to the total price of your next
                                        order.
                                    </li>
                                    <li>
                                        If you have accumulated strikes, one
                                        strike will be deducted for every 10%
                                        fee paid.
                                    </li>
                                    <li>
                                        For example, if you have 1 strike and
                                        pay a 10% fee on your new order, your
                                        strike count will be reduced to 0.
                                    </li>
                                </ul>

                                <h2 className="text-lg font-semibold">
                                    Changes
                                </h2>
                                <p className="text-gray-400">
                                    We reserve the right to change these terms
                                    and conditions at any time.
                                </p>

                                <h2 className="text-lg font-semibold">
                                    Developer Rights
                                </h2>
                                <ul className="list-inside list-disc text-gray-400">
                                    <li>
                                        We reserve the right to refuse service
                                        to anyone for any reason at any time.
                                    </li>
                                    <li>
                                        We reserve the right to modify or
                                        discontinue our services at any time.
                                    </li>
                                    <li>
                                        We reserve the right to change our
                                        prices at any time.
                                    </li>
                                    <li>
                                        Any new or unique features added in the
                                        project can be used by us in personal or
                                        public projects.
                                    </li>
                                </ul>

                                <hr />

                                <p>
                                    By clicking the &quot;Agree&quot; button
                                    below, you agree to the terms and conditions
                                    stated above.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    radius="sm"
                                    color="danger"
                                    variant="light"
                                    onPress={onClose}
                                    isDisabled={isLoading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    radius="sm"
                                    color="primary"
                                    variant="flat"
                                    className="font-semibold"
                                    onPress={handleCreateProject}
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                >
                                    Agree
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

export default ProjectForm;
