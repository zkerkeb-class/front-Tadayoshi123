import { useEffect, useState } from "react"

/**
 * Hook personnalisé pour gérer les media queries
 * @param query - La media query à surveiller (ex: "(max-width: 768px)")
 * @returns boolean - True si la media query correspond, false sinon
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    // Vérifier si window est disponible (côté client uniquement)
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia(query)
      
      // Définir l'état initial
      setMatches(mediaQuery.matches)
      
      // Fonction de callback pour les changements
      const handleChange = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }
      
      // Ajouter l'écouteur d'événements
      mediaQuery.addEventListener("change", handleChange)
      
      // Nettoyer l'écouteur lors du démontage
      return () => {
        mediaQuery.removeEventListener("change", handleChange)
      }
    }
    
    // Valeur par défaut pour le SSR
    return () => {}
  }, [query])

  return matches
} 