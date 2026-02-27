import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import {
  faHammer,
  faCopy,
  faIndustry,
  faGear,
  faDiamond,
  faPlug,
  faBuildingColumns,
  faLayerGroup,
  faShieldHalved,
  faSitemap,
  faBridge,
  faEye,
  faChessPawn,
  faArrowsRotate,
  faTerminal,
  faLink,
  faRulerCombined,
  faCubes,
  faPuzzlePiece,
  faBolt,
  faDesktop,
  faSun,
  faMoon,
  faXmark,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

const ICON_MAP: Record<string, IconDefinition> = {
  diamond: faDiamond,
  hammer: faHammer,
  copy: faCopy,
  industry: faIndustry,
  gear: faGear,
  plug: faPlug,
  "building-columns": faBuildingColumns,
  "layer-group": faLayerGroup,
  "shield-halved": faShieldHalved,
  sitemap: faSitemap,
  bridge: faBridge,
  eye: faEye,
  "chess-pawn": faChessPawn,
  "arrows-rotate": faArrowsRotate,
  terminal: faTerminal,
  link: faLink,
  "ruler-combined": faRulerCombined,
  cubes: faCubes,
  "puzzle-piece": faPuzzlePiece,
  bolt: faBolt,
  desktop: faDesktop,
  sun: faSun,
  moon: faMoon,
  xmark: faXmark,
  "arrow-right": faArrowRight,
};

interface IconProps {
  name: string;
  className?: string;
  label?: string;
}

/**
 * Renders a FontAwesome SVG icon by name.
 * Works in both Server Components and Client Components.
 */
export function Icon({ name, className = "h-4 w-4", label }: IconProps) {
  const def = ICON_MAP[name];
  if (!def) return null;

  const [width, height, , , path] = def.icon;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      fill="currentColor"
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {typeof path === "string" ? (
        <path d={path} />
      ) : (
        path.map((d, i) => <path key={i} d={d} />)
      )}
    </svg>
  );
}
