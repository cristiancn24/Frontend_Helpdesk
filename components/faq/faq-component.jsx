"use client"

import { useState } from "react"
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
import VisibleByRole from "@/components/VisibleByRole"

export default function FAQComponent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState({})
  const [isNewFAQOpen, setIsNewFAQOpen] = useState(false)

  const [newFAQ, setNewFAQ] = useState({
    subject: "",
    category: "",
    description: "",
  })

  const categories = [
    {
      id: "all",
      name: "Todas",
      icon: HelpCircle,
      count: 45,
      color: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    },
    {
      id: "technical",
      name: "Soporte Técnico",
      icon: Monitor,
      count: 12,
      color: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    },
    {
      id: "account",
      name: "Cuenta y Acceso",
      icon: Shield,
      count: 8,
      color: "bg-green-100 text-green-800 hover:bg-green-200",
    },
    {
      id: "billing",
      name: "Facturación",
      icon: CreditCard,
      count: 6,
      color: "bg-purple-100 text-purple-800 hover:bg-purple-200",
    },
    {
      id: "features",
      name: "Funcionalidades",
      icon: Settings,
      count: 9,
      color: "bg-orange-100 text-orange-800 hover:bg-orange-200",
    },
    {
      id: "network",
      name: "Red y Conectividad",
      icon: Wifi,
      count: 5,
      color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-200",
    },
    {
      id: "security",
      name: "Seguridad",
      icon: Lock,
      count: 7,
      color: "bg-red-100 text-red-800 hover:bg-red-200",
    },
    {
      id: "email",
      name: "Correo Electrónico",
      icon: Mail,
      count: 4,
      color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    },
    {
      id: "mobile",
      name: "Aplicaciones Móviles",
      icon: Smartphone,
      count: 6,
      color: "bg-pink-100 text-pink-800 hover:bg-pink-200",
    },
    {
      id: "database",
      name: "Base de Datos",
      icon: Database,
      count: 3,
      color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    },
    {
      id: "printing",
      name: "Impresión",
      icon: Printer,
      count: 4,
      color: "bg-teal-100 text-teal-800 hover:bg-teal-200",
    },
    {
      id: "users",
      name: "Gestión de Usuarios",
      icon: Users,
      count: 5,
      color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200",
    },
  ]

  const faqData = [
    {
      id: 1,
      category: "technical",
      question: "¿Cómo puedo restablecer mi contraseña?",
      answer:
        "Para restablecer tu contraseña, dirígete a la página de inicio de sesión y haz clic en el enlace '¿Olvidaste tu contraseña?'. Ingresa tu dirección de correo electrónico registrada y recibirás un mensaje con un enlace para crear una nueva contraseña. Este enlace será válido por 24 horas por motivos de seguridad. Una vez que hagas clic en el enlace, podrás establecer una nueva contraseña que debe tener al menos 8 caracteres e incluir una combinación de letras, números y símbolos.",
      tags: ["contraseña", "acceso", "login"],
    },
    {
      id: 2,
      category: "technical",
      question: "El sistema está muy lento, ¿qué puedo hacer?",
      answer:
        "La lentitud del sistema puede deberse a varios factores. Primero, verifica que no tengas demasiadas pestañas abiertas en tu navegador, ya que esto consume memoria. Limpia la caché y las cookies de tu navegador desde la configuración. Asegúrate de que tu conexión a internet sea estable ejecutando una prueba de velocidad. Si el problema persiste, intenta acceder desde un navegador diferente o desde modo incógnito. También verifica que no tengas programas pesados ejecutándose en segundo plano en tu computadora.",
      tags: ["rendimiento", "lentitud", "navegador"],
    },
    {
      id: 3,
      category: "account",
      question: "¿Cómo puedo cambiar mi información personal?",
      answer:
        "Para actualizar tu información personal, inicia sesión en tu cuenta y navega hasta la sección 'Mi Perfil' o 'Configuración' en el menú principal. Allí encontrarás la opción 'Editar información personal' donde podrás modificar datos como tu nombre, dirección, teléfono y otros detalles de contacto. Después de realizar los cambios, asegúrate de guardar la información haciendo clic en 'Guardar cambios'. Ten en cuenta que algunos cambios, especialmente los relacionados con información de facturación, pueden requerir verificación adicional por correo electrónico.",
      tags: ["perfil", "información", "datos"],
    },
    {
      id: 4,
      category: "billing",
      question: "¿Dónde puedo ver mis facturas?",
      answer:
        "Puedes acceder a todas tus facturas desde tu panel de control personal. Una vez que inicies sesión, dirígete a la sección 'Facturación' en el menú lateral y selecciona 'Historial de facturas'. Desde esta página podrás ver, descargar e imprimir cualquier factura de los últimos 24 meses. Las facturas están organizadas por fecha y puedes filtrarlas por período específico si lo necesitas. También recibes una copia por correo electrónico cada vez que se genera una nueva factura.",
      tags: ["facturas", "pagos", "historial"],
    },
    {
      id: 5,
      category: "features",
      question: "¿Cómo puedo crear una nueva pregunta para el FAQ?",
      answer:
        "Para sugerir una nueva pregunta para el FAQ, utiliza el botón 'Crear Nueva Pregunta' que encontrarás en la parte superior de esta página. Completa el formulario indicando la categoría más apropiada, escribe tu pregunta de manera clara y concisa, y proporciona el contexto necesario para que nuestro equipo pueda preparar una respuesta completa. Tu sugerencia será revisada por nuestro equipo de soporte y, si es aprobada, se agregará al FAQ para beneficiar a otros usuarios con dudas similares.",
      tags: ["faq", "pregunta", "sugerencia"],
    },
    {
      id: 6,
      category: "mobile",
      question: "No puedo acceder al sistema desde mi móvil",
      answer:
        "Los problemas de acceso móvil suelen estar relacionados con la compatibilidad del navegador o la conexión. Asegúrate de estar usando la versión más reciente de tu navegador móvil, preferiblemente Chrome para Android o Safari para iOS. Verifica que tengas una conexión estable a internet y suficiente señal. Si el problema persiste, intenta limpiar la caché del navegador móvil o acceder desde el modo incógnito. El sistema está optimizado para dispositivos móviles, pero algunos navegadores antiguos pueden presentar incompatibilidades.",
      tags: ["móvil", "acceso", "navegador"],
    },
    {
      id: 7,
      category: "account",
      question: "¿Cómo puedo cerrar mi cuenta?",
      answer:
        "Para cerrar tu cuenta permanentemente, necesitas contactar directamente a nuestro equipo de soporte ya que este es un proceso que requiere verificación de identidad. Crea una solicitud especificando que deseas cerrar tu cuenta y proporciona la razón del cierre. Nuestro equipo te guiará a través del proceso y te informará sobre las implicaciones, como la pérdida de acceso a datos y servicios. Te recomendamos descargar cualquier información importante antes de proceder, ya que este proceso generalmente es irreversible.",
      tags: ["cerrar cuenta", "cancelar", "eliminar"],
    },
    {
      id: 8,
      category: "billing",
      question: "¿Qué métodos de pago aceptan?",
      answer:
        "Aceptamos una amplia variedad de métodos de pago para tu comodidad. Puedes pagar con tarjetas de crédito y débito Visa, MasterCard y American Express. También aceptamos transferencias bancarias directas y pagos a través de PayPal. Todos los pagos se procesan de forma segura utilizando encriptación SSL y cumpliendo con los estándares PCI DSS. Una vez procesado el pago, recibirás una confirmación automática por correo electrónico con los detalles de la transacción.",
      tags: ["pagos", "métodos", "tarjetas"],
    },
    {
      id: 9,
      category: "network",
      question: "Tengo problemas de conexión intermitente",
      answer:
        "Los problemas de conexión intermitente pueden tener varias causas. Primero, verifica la estabilidad de tu conexión a internet ejecutando una prueba de velocidad en diferentes momentos del día. Si usas WiFi, intenta acercarte al router o conectarte directamente por cable ethernet para descartar problemas de señal inalámbrica. También verifica que no haya interferencias de otros dispositivos electrónicos. Si el problema persiste solo con nuestro sistema, puede ser un problema temporal de nuestros servidores que nuestro equipo técnico estará resolviendo.",
      tags: ["conexión", "internet", "wifi"],
    },
    {
      id: 10,
      category: "security",
      question: "¿Cómo puedo activar la autenticación de dos factores?",
      answer:
        "La autenticación de dos factores (2FA) añade una capa extra de seguridad a tu cuenta. Para activarla, ve a la sección 'Seguridad' en tu perfil de usuario. Selecciona 'Configurar autenticación de dos factores' y elige tu método preferido: aplicación autenticadora (como Google Authenticator) o SMS. Si eliges la aplicación, escanea el código QR que aparece en pantalla. Para SMS, verifica tu número de teléfono. Una vez configurado, necesitarás ingresar el código de verificación cada vez que inicies sesión desde un dispositivo nuevo.",
      tags: ["seguridad", "2fa", "autenticación"],
    },
  ]

  const filteredFAQs = faqData.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleSubmitNewFAQ = (e) => {
    e.preventDefault()
    console.log("Nueva pregunta:", newFAQ)
    setNewFAQ({ subject: "", category: "", description: "" })
    setIsNewFAQOpen(false)
  }

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
              <VisibleByRole roles={[1, 2, 3, 4, 11]}>
              <Button onClick={() => setIsNewFAQOpen(true)} className="bg-cyan-500 hover:bg-cyan-600 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Crear Nueva Pregunta
              </Button>
              </VisibleByRole>
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
              {categories.map((category) => {
                const Icon = category.icon
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`h-auto p-3 flex flex-col items-center gap-2 ${
                      selectedCategory === category.id
                        ? "bg-cyan-500 hover:bg-cyan-600 text-white"
                        : `${category.color} border-gray-200`
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
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
                                <h3 className="font-medium text-gray-900">{faq.question}</h3>
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
                                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
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
