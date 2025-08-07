"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  HelpCircle,
  Monitor,
  Shield,
  CreditCard,
  Settings,
  Lightbulb,
  Users,
  Smartphone,
  Database,
  Wifi,
  Lock,
  Mail,
  Printer,
} from "lucide-react"
import MainLayout from "@/components/layout/main-layout"
import { getFAQs, createFAQ } from "@/services/faqService"
import  { getCategories }  from "@/services/categoryService"
import { toast }  from "react-toastify"
import * as Icons from "lucide-react"

export default function FAQComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState({})
  const [isNewFAQOpen, setIsNewFAQOpen] = useState(false)
  const [faqs, setFAQs] = useState([])
  const [categories, setCategories] = useState([])
  const [showAllCategories, setShowAllCategories] = useState(false);
  const visibleCategories = showAllCategories ? categories : categories.slice(0, 12);



  const [newFAQ, setNewFAQ] = useState({
    subject: "",
    category: "",
    description: "",
  })


  const filteredFAQs = faqs.filter((faq) => {
  const matchesSearch =
    faq.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.description?.toLowerCase().includes(searchTerm.toLowerCase())

  const matchesCategory =
    selectedCategory === "all" || faq.category_service_id === selectedCategory

  return matchesSearch && matchesCategory
})


  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSubmitNewFAQ = async (e) => {
  e.preventDefault();
  try {
    const payload = {
      subject: newFAQ.subject,
      description: newFAQ.description,
      category_service_id: parseInt(newFAQ.category),
    };

    const result = await createFAQ(payload);

    if (result?.success) {
      toast.success("Pregunta creada exitosamente");
      setNewFAQ({ subject: "", category: "", description: "" });
      setIsNewFAQOpen(false);
    } else {
      throw new Error("Respuesta inesperada del servidor");
    }
  } catch (error) {
    console.error("Hubo un error al crear la pregunta:", error);
    toast.error("Hubo un error al crear la pregunta");
  }
};

 useEffect(() => {
  const fetchFAQs = async () => {
    try {
      const response = await getFAQs()
      console.log("FAQs desde API:", response)
      setFAQs(response.data) // ✅ ahora faqs será un array
    } catch (error) {
      console.error("Error al cargar FAQs:", error)
    }
  }

  fetchFAQs()
}, [])

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const response = await getCategories();

      const totalCount = response.reduce((acc, curr) => acc + curr.count, 0);

      setCategories([
        {
          id: "all",
          name: "Todas",
          count: totalCount,
          icon: "HelpCircle",
          color: "bg-gray-100 text-gray-800",
        },
        ...response,
      ]);
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  };

  fetchCategories();
}, []);


  return (
    <MainLayout title="FAQ - Preguntas Frecuentes">
      <div className="space-y-6">
        {/* Búsqueda y acciones */}
        <Dialog open={isNewFAQOpen} onOpenChange={setIsNewFAQOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Crear Nueva Pregunta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitNewFAQ} className="space-y-4">
              <div>
                <Label>Asunto</Label>
                <Input
                  value={newFAQ.subject}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, subject: e.target.value }))}
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <select
                  value={newFAQ.category}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border rounded px-2 py-1"
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.filter(c => c.id !== "all").map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Descripción</Label>
                <Textarea
                  value={newFAQ.description}
                  onChange={(e) => setNewFAQ(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <Button type="submit" className="w-full bg-cyan-500 text-white">
                Guardar
              </Button>
            </form>
          </DialogContent>
        </Dialog>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar en preguntas frecuentes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setIsNewFAQOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nueva Pregunta
              </Button>
            </div>
          </CardContent>
        </Card>

        

        {/* Categorías en grid horizontal */}
        <Card>
          <CardHeader>
            <CardTitle>Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
              {visibleCategories.map((category) => {
                const Icon = Icons[category.icon] || HelpCircle // fallback si el nombre no existe
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : `${category.color} border-gray-200`
                    }`}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowAllCategories(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-center">
                      <p className="text-xs font-medium leading-tight">{category.name}</p>
                      <p className="text-xs opacity-75">({category.count})</p>
                    </div>
                  </Button>
                )
              })}
            </div>
            {categories.length > 12 && (
              <div className="mt-4 text-right">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                >
                  {showAllCategories ? "Ver menos" : "Ver todas las categorías"}
                </Button>
              </div>
            )}

          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar con tips */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Tips Útiles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900">💡 Consejo</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Usa palabras clave específicas para encontrar respuestas más rápido
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido principal - Lista de FAQs */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {searchTerm || selectedCategory !== "all"
                    ? `Resultados (${filteredFAQs.length})`
                    : "Todas las Preguntas Frecuentes"}
                </CardTitle>
                {searchTerm && (
                  <p className="text-sm text-gray-600">
                    Mostrando resultados para: <span className="font-medium">"{searchTerm}"</span>
                  </p>
                )}
              </CardHeader>
              <CardContent>
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12">
                    <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron resultados</h3>
                    <p className="text-gray-600 mb-4">No pudimos encontrar preguntas que coincidan con tu búsqueda.</p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" onClick={() => setSearchTerm("")}>
                        Limpiar búsqueda
                      </Button>
                      <Button className="bg-cyan-500 hover:bg-cyan-600">
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Nueva Pregunta
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq) => (
                      <Collapsible key={faq.id} open={openItems[faq.id]} onOpenChange={() => toggleItem(faq.id)}>
                        <div className="border border-gray-200 rounded-lg">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" className="w-full p-4 text-left justify-between hover:bg-gray-50">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{faq.subject}</h3>
                              </div>
                              {openItems[faq.id] ? (
                                <ChevronUp className="h-5 w-5 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="px-4 pb-4 border-t border-gray-100">
                              <div className="pt-4">
                                <p className="text-gray-700 leading-relaxed">{faq.description}</p>
                              </div>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
