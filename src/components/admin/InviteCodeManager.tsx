"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { toast } from "sonner";

interface InviteCode {
  id: string;
  code: string;
  email?: string;
  used: boolean;
  usedBy?: string;
  usedAt?: string;
  expiresAt?: string;
  createdAt: string;
}

export function InviteCodeManager() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newCode, setNewCode] = useState({
    email: "",
    expiresInDays: "7",
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch("/api/admin/invite-codes");
      if (response.ok) {
        const data = await response.json();
        setCodes(data.codes);
      }
    } catch (error) {
      toast.error("Error al cargar códigos de invitación");
    }
  };

  const generateCode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/invite-codes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newCode.email || undefined,
          expiresInDays: parseInt(newCode.expiresInDays),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Código de invitación generado exitosamente");
        setNewCode({ email: "", expiresInDays: "7" });
        fetchCodes();
      } else {
        const error = await response.json();
        toast.error(error.message || "Error al generar código");
      }
    } catch (error) {
      toast.error("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Código copiado al portapapeles");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generar Código de Invitación</CardTitle>
          <CardDescription>
            Crea códigos de invitación para nuevos usuarios
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email (opcional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@ejemplo.com"
                value={newCode.email}
                onChange={(e) => setNewCode({ ...newCode, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresInDays">Expira en (días)</Label>
              <Input
                id="expiresInDays"
                type="number"
                min="1"
                max="365"
                value={newCode.expiresInDays}
                onChange={(e) => setNewCode({ ...newCode, expiresInDays: e.target.value })}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={generateCode} disabled={isLoading} className="w-full">
                {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
                Generar Código
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Códigos de Invitación</CardTitle>
          <CardDescription>
            Lista de códigos generados y su estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {codes.map((code) => (
              <div
                key={code.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                      {code.code}
                    </code>
                    {code.used ? (
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                        Usado
                      </span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Disponible
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {code.email && <span>Email: {code.email}</span>}
                    {code.used && code.usedBy && (
                      <span className="ml-2">Usado por: {code.usedBy}</span>
                    )}
                    <span className="ml-2">
                      Creado: {new Date(code.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {!code.used && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(code.code)}
                  >
                    Copiar
                  </Button>
                )}
              </div>
            ))}
            {codes.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No hay códigos de invitación generados
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 