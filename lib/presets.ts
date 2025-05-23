import type { Preset } from "./types"

export const presets: Preset[] = [
  {
    id: "simple-profile",
    name: "Simple Profile",
    description: "A clean profile card with heading and description",
    thumbnail: "/simple-profile.png",
    entities: {
      "profile-container": {
        name: "Profile Card",
        order: 0,
        components: {
          ColorPaletteComponent: {
            type: "ColorPaletteComponent",
            data: {
              palette: "default",
              primary: "#4f46e5",
              secondary: "#10b981",
              accent: "#f59e0b",
              background: "#ffffff",
              text: "#1f2937",
            },
          },
        },
        children: ["profile-title", "profile-description"],
      },
      "profile-title": {
        name: "Profile Title",
        order: 0,
        parentId: "profile-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "John Doe",
              isHeading: true,
              headingLevel: 1,
              textAlign: "center",
            },
          },
        },
      },
      "profile-description": {
        name: "Profile Description",
        order: 1,
        parentId: "profile-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "Web Developer & Designer passionate about creating beautiful user experiences.",
              isHeading: false,
              textAlign: "center",
            },
          },
        },
      },
    },
  },
  {
    id: "business-card",
    name: "Business Card",
    description: "Professional business card with image and contact info",
    thumbnail: "/placeholder.svg?height=100&width=150&query=business%20card",
    entities: {
      "business-container": {
        name: "Business Card",
        order: 0,
        components: {
          ColorPaletteComponent: {
            type: "ColorPaletteComponent",
            data: {
              palette: "professional",
              primary: "#0f172a",
              secondary: "#475569",
              accent: "#0ea5e9",
              background: "#f8fafc",
              text: "#334155",
            },
          },
        },
        children: ["business-logo", "business-name", "business-title"],
      },
      "business-logo": {
        name: "Company Logo",
        order: 0,
        parentId: "business-container",
        components: {
          ImageComponent: {
            type: "ImageComponent",
            data: {
              url: "/placeholder.svg?height=80&width=80&query=company%20logo",
              alt: "Company logo",
              width: "80px",
              height: "80px",
              borderRadius: "0.5rem",
              shadow: false,
            },
          },
        },
      },
      "business-name": {
        name: "Name",
        order: 1,
        parentId: "business-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "Jane Smith",
              isHeading: true,
              headingLevel: 2,
              textAlign: "center",
            },
          },
        },
      },
      "business-title": {
        name: "Job Title",
        order: 2,
        parentId: "business-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "Senior Product Manager",
              isHeading: false,
              textAlign: "center",
            },
          },
        },
      },
    },
  },
  {
    id: "portfolio-card",
    name: "Portfolio Card",
    description: "Showcase your work with image and description",
    thumbnail: "/placeholder.svg?height=100&width=150&query=portfolio%20card",
    entities: {
      "portfolio-container": {
        name: "Portfolio Card",
        order: 0,
        components: {
          ColorPaletteComponent: {
            type: "ColorPaletteComponent",
            data: {
              palette: "vibrant",
              primary: "#4f46e5",
              secondary: "#059669",
              accent: "#d97706",
              background: "#ffffff",
              text: "#111827",
            },
          },
        },
        children: ["portfolio-image", "portfolio-title", "portfolio-description"],
      },
      "portfolio-image": {
        name: "Portfolio Image",
        order: 0,
        parentId: "portfolio-container",
        components: {
          ImageComponent: {
            type: "ImageComponent",
            data: {
              url: "/placeholder.svg?height=200&width=300&query=portfolio%20project",
              alt: "Portfolio project",
              width: "100%",
              height: "200px",
              borderRadius: "0.5rem",
              shadow: true,
            },
          },
        },
      },
      "portfolio-title": {
        name: "Project Title",
        order: 1,
        parentId: "portfolio-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "Amazing Project",
              isHeading: true,
              headingLevel: 3,
              textAlign: "left",
            },
          },
        },
      },
      "portfolio-description": {
        name: "Project Description",
        order: 2,
        parentId: "portfolio-container",
        components: {
          TextComponent: {
            type: "TextComponent",
            data: {
              content: "This project showcases modern web development techniques and beautiful design principles.",
              isHeading: false,
              textAlign: "left",
            },
          },
        },
      },
    },
  },
]

export const getPresetById = (id: string): Preset | undefined => {
  return presets.find((preset) => preset.id === id)
}
