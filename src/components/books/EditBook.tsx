"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateBook } from "@/app/actions";
import { useState, useRef, useEffect } from "react";
import { Loader2, Camera, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, BookSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import type { Book } from "@prisma/client";

interface EditBookProps {
  book: Book;
  children: React.ReactNode;
}

export function EditBook({ book, children }: EditBookProps) {
  const [open, setOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(book.cover);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      cover: book.cover || "",
      publishedAt: book.publishedAt ? new Date(book.publishedAt).toISOString().split('T')[0] : "",
      description: book.description || "",
      notes: book.notes || "",
    },
  });
  
  useEffect(() => {
    form.reset({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      cover: book.cover || "",
      publishedAt: book.publishedAt ? new Date(book.publishedAt).toISOString().split('T')[0] : "",
      description: book.description || "",
      notes: book.notes || "",
    });
    setCoverPreview(book.cover);
  }, [book, form]);

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value) {
        if (key === 'cover' && typeof value !== 'string') {
          const fileList = value as FileList;
          if (fileList.length > 0) {
            formData.append(key, fileList[0]);
          }
        } else {
          formData.append(key, value as string);
        }
      }
    });

    if (!formData.has('cover') && coverPreview) {
      formData.append('cover', coverPreview);
    }

    const result = await updateBook(book.id, formData);

    if (result.success) {
      toast.success("Success", { description: "Book updated successfully." });
      setOpen(false);
    } else {
      toast.error("Error", { description: result.error });
    }
  });

  const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Make changes to your book here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="w-2/3 space-y-2">
              <div className="space-y-1">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="author">Author</Label>
                <Input id="author" {...form.register("author")} />
              </div>
            </div>
            <div className="w-1/3 space-y-1">
              <Label>Cover</Label>
              <div className="aspect-square bg-muted rounded-md flex items-center justify-center relative">
                {coverPreview ? (
                  <>
                    <Image src={coverPreview} alt="Cover preview" fill style={{ objectFit: "cover" }} className="rounded-md" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => {
                        setCoverPreview(null);
                        form.setValue("cover", undefined);
                        if(fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-6 w-6" />
                  </Button>
                )}
              </div>
              <Input 
                  type="file"
                  accept="image/*"
                  className="hidden" 
                  {...form.register("cover")} 
                  ref={fileInputRef}
                  onChange={handleCoverChange}
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...form.register("description")} />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 
