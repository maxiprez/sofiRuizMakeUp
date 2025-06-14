import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { BarChart3, Calendar, Users, Scissors, Clock, Home } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
    },
    {
      title: "Dashboard",
      icon: BarChart3,
      url: "/admin",
    },
    {
      title: "Citas",
      icon: Calendar,
      url: "/admin/dates",
    },
    {
      title: "Clientes",
      icon: Users,
      url: "/admin/customers",
    },
    {
      title: "Servicios",
      icon: Scissors,
      url: "/admin/categories",
    },
    {
      title: "Horarios",
      icon: Clock,
      url: "/admin/schedules",
    },
    // {
    //   title: "Configuración",
    //   icon: Settings,
    //   url: "#settings",
    // },
]

export function SidebarAdmin() {
    return (
      <Sidebar className="border-r border-purple-100">
        <SidebarHeader className="border-b border-purple-100 p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white font-bold text-sm">
              S
            </div>
            <div>
              <h2 className="text-lg font-bold text-pink-600">SofiRuiz</h2>
              <p className="text-xs text-gray-500">Panel Admin</p>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-purple-700 font-medium">Menú Principal</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="hover:bg-purple-50 hover:text-purple-700 data-[active=true]:bg-pink-50 data-[active=true]:text-pink-700 data-[active=true]:border-r-2 data-[active=true]:border-pink-500"
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-purple-100 p-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-pink-100 text-pink-700">SR</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">Sofi Ruiz</p>
              <p className="text-xs text-gray-500 truncate">Administrador</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    )
  }