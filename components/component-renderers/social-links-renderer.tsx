import type { SocialLinksData } from "@/lib/types"
import { Twitter, Instagram, Linkedin, Facebook, Github, Youtube, Dribbble, Twitch, Globe, AtSign } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinksRendererProps {
  data: SocialLinksData
}

export default function SocialLinksRenderer({ data }: SocialLinksRendererProps) {
  const { links, displayStyle, size, color } = data

  const getSocialIcon = (platform: string) => {
    const iconProps = {
      className: cn(
        "inline-block",
        size === "small" && "h-4 w-4",
        size === "medium" && "h-5 w-5",
        size === "large" && "h-6 w-6",
      ),
      style: color ? { color } : undefined,
    }

    switch (platform.toLowerCase()) {
      case "twitter":
      case "x":
        return <Twitter {...iconProps} />
      case "instagram":
        return <Instagram {...iconProps} />
      case "linkedin":
        return <Linkedin {...iconProps} />
      case "facebook":
        return <Facebook {...iconProps} />
      case "github":
        return <Github {...iconProps} />
      case "youtube":
        return <Youtube {...iconProps} />
      case "dribbble":
        return <Dribbble {...iconProps} />
      case "twitch":
        return <Twitch {...iconProps} />
      case "website":
        return <Globe {...iconProps} />
      default:
        return <AtSign {...iconProps} />
    }
  }

  const getSizeClass = () => {
    switch (size) {
      case "small":
        return "text-sm gap-3"
      case "large":
        return "text-lg gap-5"
      case "medium":
      default:
        return "text-base gap-4"
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center", getSizeClass())}>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={cn("flex items-center gap-2 hover:opacity-80 transition-opacity", color ? "" : "text-primary")}
          style={color ? { color } : undefined}
        >
          {(displayStyle === "icon" || displayStyle === "both") && getSocialIcon(link.platform)}
          {(displayStyle === "text" || displayStyle === "both") && <span>{link.username || link.platform}</span>}
        </a>
      ))}
    </div>
  )
}
