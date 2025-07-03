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
import { useState, useTransition, useRef, useEffect } from "react";
import { Plus, ScanLine, Loader2, Camera, X, ChevronLeft, ChevronRight, Tag, MapPin, Calendar, DollarSign, BookOpen, User, Check } from "lucide-react";
import { BarcodeScanner } from "./BarcodeScanner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookFormValues, BookSchema } from "@/lib/schemas";
import { toast } from "sonner";
import { Textarea } from "../ui/textarea";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type Step = 1 | 2 | 3 | 4;

export function AddBookWizard() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isScannerOpen, setScannerOpen] = useState(false);
  const [isSearching, startSearching] = useTransition();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
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
      purchaseDate: "",
      price: undefined,
      condition: "GOOD",
      location: "",
      isLent: false,
      lentTo: "",
      lentAt: "",
      tags: [],
    },
  });

  // Guardado automático en localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('bookFormDraft');
    if (savedData && open) {
      try {
        const parsed = JSON.parse(savedData);
        form.reset(parsed);
        if (parsed.tags) {
          setTags(parsed.tags);
        }
        if (parsed.cover) {
          setCoverPreview(parsed.cover);
        }
      } catch (error) {
        console.error('Error loading saved form data:', error);
      }
    }
  }, [open]);

  // Guardar automáticamente cambios
  useEffect(() => {
    if (open) {
      const subscription = form.watch((value) => {
        const dataToSave = { ...value, tags };
        localStorage.setItem('bookFormDraft', JSON.stringify(dataToSave));
      });
      return () => subscription.unsubscribe();
    }
  }, [form, tags, open]);

  const handleScan = (isbn: string) => {
    setScannerOpen(false);
    setOpen(true);
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
        toast.success("¡Libro encontrado!", { description: "Los detalles se han completado automáticamente." });
      } else {
        toast.error("No encontrado", { description: "No se encontró ningún libro con este ISBN." });
      }
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updatedTags = [...tags, newTag.trim()];
      setTags(updatedTags);
      form.setValue("tags", updatedTags);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    form.setValue("tags", updatedTags);
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    const formData = new FormData();

    // Append all form data
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        if (key === 'cover') {
          const fileList = value as FileList;
          if (fileList && fileList.length > 0) {
            formData.append('cover', fileList[0]);
          }
        } else if (key === 'tags') {
          formData.append('tags', JSON.stringify(tags));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Handle cover URL from API
    if (!formData.has('cover') && coverPreview) {
      formData.append('cover', coverPreview);
    }

    const result = await addBook(formData);

    if (result.success) {
      toast.success("¡Éxito!", { description: "Libro añadido a tu colección." });
      form.reset();
      setCoverPreview(null);
      setTags([]);
      localStorage.removeItem('bookFormDraft');
      setOpen(false);
      setCurrentStep(1);
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
    setTags([]);
    localStorage.removeItem('bookFormDraft');
    setCurrentStep(1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
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
                  <Label htmlFor="title">Título *</Label>
                  <Input id="title" {...form.register("title")} />
                  {form.formState.errors.title && <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="author">Autor *</Label>
                  <Input id="author" {...form.register("author")} />
                  {form.formState.errors.author && <p className="text-sm text-red-500">{form.formState.errors.author.message}</p>}
                </div>
              </div>
              <div className="w-1/3 space-y-1">
                <Label>Portada</Label>
                <div className="aspect-square bg-muted rounded-md flex items-center justify-center relative">
                  {coverPreview ? (
                    <>
                      <Image src={coverPreview} alt="Vista previa de portada" fill style={{ objectFit: "cover" }} className="rounded-md" />
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
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...form.register("description")} />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="purchaseDate">Fecha de compra</Label>
                <Input 
                  id="purchaseDate" 
                  type="date" 
                  {...form.register("purchaseDate")} 
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="price">Precio</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="price" 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00"
                    className="pl-10"
                    {...form.register("price", { valueAsNumber: true })} 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="condition">Estado del libro</Label>
              <Select onValueChange={(value: string) => form.setValue("condition", value as "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR")} defaultValue={form.getValues("condition")}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NEW">Nuevo</SelectItem>
                  <SelectItem value="LIKE_NEW">Como nuevo</SelectItem>
                  <SelectItem value="GOOD">Bueno</SelectItem>
                  <SelectItem value="FAIR">Regular</SelectItem>
                  <SelectItem value="POOR">Malo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="location">Ubicación física</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="location" 
                  placeholder="Ej: Estante 1, Caja 2, etc."
                  className="pl-10"
                  {...form.register("location")} 
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Etiquetas personalizadas</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Añadir etiqueta..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} size="sm">
                  <Tag className="h-4 w-4" />
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <div key={tag} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes">Notas personales</Label>
              <Textarea 
                id="notes" 
                placeholder="Comentarios, impresiones, etc."
                {...form.register("notes")} 
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isLent"
                  {...form.register("isLent")}
                  className="rounded"
                />
                <Label htmlFor="isLent">¿Está prestado?</Label>
              </div>
            </div>

            {form.watch("isLent") && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <div className="space-y-1">
                  <Label htmlFor="lentTo">Prestado a</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="lentTo" 
                      placeholder="Nombre de la persona"
                      className="pl-10"
                      {...form.register("lentTo")} 
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="lentAt">Fecha de préstamo</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="lentAt" 
                      type="date"
                      className="pl-10"
                      {...form.register("lentAt")} 
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">Resumen del libro</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Título:</strong> {form.watch("title") || "No especificado"}</p>
                <p><strong>Autor:</strong> {form.watch("author") || "No especificado"}</p>
                <p><strong>ISBN:</strong> {form.watch("isbn") || "No especificado"}</p>
                <p><strong>Estado:</strong> {form.watch("condition") === "NEW" ? "Nuevo" : 
                                           form.watch("condition") === "LIKE_NEW" ? "Como nuevo" :
                                           form.watch("condition") === "GOOD" ? "Bueno" :
                                           form.watch("condition") === "FAIR" ? "Regular" :
                                           form.watch("condition") === "POOR" ? "Malo" : "Bueno"}</p>
                {form.watch("location") && <p><strong>Ubicación:</strong> {form.watch("location")}</p>}
                {tags.length > 0 && <p><strong>Etiquetas:</strong> {tags.join(", ")}</p>}
                {form.watch("isLent") && <p><strong>Prestado a:</strong> {form.watch("lentTo") || "No especificado"}</p>}
              </div>
            </div>
          </div>
        );
    }
  };

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
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
          <DialogHeader>
            <DialogTitle>Añadir Nuevo Libro</DialogTitle>
            <DialogDescription>
              Paso {currentStep} de 4: {currentStep === 1 ? "Información básica" : 
                                      currentStep === 2 ? "Detalles de compra" :
                                      currentStep === 3 ? "Categorización" : "Préstamo"}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={onSubmit} className="space-y-6">
            {renderStep()}

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Anterior
                  </Button>
                )}
                {currentStep < 4 && (
                  <Button type="button" onClick={nextStep}>
                    Siguiente
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancelar</Button>
                </DialogClose>
                {currentStep === 4 && (
                  <Button type="submit" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    Guardar Libro
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {isScannerOpen && <BarcodeScanner onScan={handleScan} onClose={closeScanner} />}
    </>
  );
} 