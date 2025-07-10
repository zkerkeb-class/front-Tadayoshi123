"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"
import { motion } from "framer-motion"

const testimonials = [
  {
    content:
      "SupervIA has transformed how we monitor our infrastructure. The AI-powered insights have helped us prevent multiple outages and saved us thousands in potential downtime costs.",
    author: "Sarah Chen",
    role: "DevOps Manager",
    company: "TechFlow Inc.",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    content:
      "The predictive analytics feature is game-changing. We can now identify and resolve issues before they impact our customers. The dashboard customization is also fantastic.",
    author: "Michael Rodriguez",
    role: "Infrastructure Lead",
    company: "CloudScale Solutions",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
  {
    content:
      "Implementation was seamless, and the support team is exceptional. We've reduced our MTTR by 60% since switching to SupervIA. Highly recommend for any serious infrastructure team.",
    author: "Emily Johnson",
    role: "Site Reliability Engineer",
    company: "DataCore Systems",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
  },
]

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Badge variant="secondary" className="mb-4">
              Testimonials
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Loved by infrastructure teams worldwide</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              See what our customers have to say about their experience with SupervIA.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-lg mb-6">"{testimonial.content}"</blockquote>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.author} />
                        <AvatarFallback>
                          {testimonial.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">{testimonial.author}</div>
                        <div className="text-sm text-muted-foreground">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
