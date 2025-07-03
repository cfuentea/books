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
import { addBook, searchBookByISBN } from "@/app/actions";
import { useState, useTransition, useRef } from "react";
import { Plus, ScanLine, Loader2, Camera, X } from "lucide-react";
import { BarcodeScanner } from "./BarcodeScanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, BookSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import Image from "next/image";

export function AddBook() {
  const [open, setOpen] = useState(false);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isSearching, startSearching] = useTransition();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<BookFormValues>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      cover: "",
      publishedAt: "",
      description: "",
      notes: "",
    },
  });

  const handleScan = (isbn: string) => {
    setScannerOpen(false);
    setOpen(true); // Re-open the dialog after scanning
    form.setValue("isbn", isbn);
    startSearching(async () => {
      const bookData = await searchBookByISBN(isbn);
      if (bookData) {
        form.reset(bookData);
        if (bookData.cover) {
            setCoverPreview(bookData.cover);
        } else {
            setCoverPreview(null);
        }
        toast.success("Book found!", { description: "Details have been filled in." });
      } else {
        toast.error("Not Found", { description: "No book found for this ISBN." });
      }
    });
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    // Append all form data
    (Object.keys(data) as Array<keyof typeof data>).forEach((key) => {
        const value = data[key];
        if (value) {
            if (key === 'cover') {
                const fileList = value as FileList;
                if (fileList && fileList.length > 0) {
                    formData.append('cover', fileList[0]);
                }
            } else {
                formData.append(key, value as string);
            }
        }
    });

    // This handles the case where the cover is a URL from the API
    // and wasn't changed by the user.
    if (!formData.has('cover') && coverPreview) {
        formData.append('cover', coverPreview);
    }

    const result = await addBook(formData);

    if (result.success) {
      toast.success("Success", { description: "Book added to your collection." });
      form.reset();
      setCoverPreview(null);
      setOpen(false);
    } else {
      toast.error("Error", { description: result.error });
    }
  });

  const openScanner = () => {
    setOpen(false);
    setScannerOpen(true);
  };

  const closeScanner = () => {
    setScannerOpen(false);
    setOpen(true);
  };

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
  
  const resetForm = () => {
    form.reset();
    setCoverPreview(null);
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button 
            onClick={resetForm}
            className="btn-animate bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="mr-2 h-4 w-4" /> Añadir Libro
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Book</DialogTitle>
            <DialogDescription>
              Scan a barcode or fill in the details manually.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input {...form.register("isbn")} placeholder="ISBN" />
              <Button type="button" variant="outline" onClick={openScanner}>
                <ScanLine className="h-4 w-4" />
              </Button>
              {isSearching && <Loader2 className="h-5 w-5 animate-spin" />}
            </div>
            
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
                  {form.formState.errors.author && <p className="text-sm text-red-500">{form.formState.errors.author.message}</p>}
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
                {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {isScannerOpen && <BarcodeScanner onScan={handleScan} onClose={closeScanner} />}
    </>
  );
} 