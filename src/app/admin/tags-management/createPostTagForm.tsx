"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateTagAction } from "./createTagAction";
import { useActionState } from "react";
import { Alert } from "@/components/ui/alert";


export function CreatePostTagForm() {
    const [state, formAction] = useActionState(CreateTagAction, {
        error: null,
    });

       return (
        <div className="flex flex-col gap-2">
            <form className="flex gap-2" action ={formAction}>
                <Input
                    type="text"
                    name="tagName"
                    placeholder="Tag Name"
                    required
                />
                <Button
                    type="submit"
                    variant={"secondary"}
                >
                    Create Tag
                </Button>
            </form>
            {state.error && <Alert variant={"destructive"} className="mt-2">{state.error}</Alert>}
        </div>
    )
}