"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
    Mail,
    Phone,
    MapPin,
    ArrowRight,
    Sparkles,
    Leaf,
    Droplets,
    Shield,
    Check,
} from "lucide-react";
import { FaInstagram, FaTwitter, FaFacebookF, FaYoutube, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useSubscribeNewsletterMutation } from "../../store/userApi";
import { getApiErrorMessage } from "../../store/apiError";
import { isApiConfigured } from "@/lib/api";

const footerLinks = {
    Shop: [
        { name: "All Products", href: "/catalog" },
        { name: "Face Serums", href: "/catalog?category=serums" },
        { name: "Face Creams", href: "/catalog?category=creams" },
        { name: "Cleanse & Tone", href: "/catalog?category=cleansers" },
        { name: "Body Care", href: "/catalog?category=body" },
        { name: "Subscribe & Save Big", href: "/subscribe-save" },
    ],
    Learn: [
        { name: "Our Story", href: "/our-story" },
        { name: "Ingredients", href: "/ingredients" },
        { name: "Skin Quiz", href: "/skin-quiz" },
        { name: "Blog", href: "/blog" },
        { name: "FAQs", href: "/faqs" },
    ],
    Support: [
        { name: "Contact Us", href: "/contact" },
        { name: "Shipping & Returns", href: "/shipping" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Track Order", href: "/track-order" },
    ],
    Business: [
        { name: "Wholesale Inquiries", href: "/wholesale" },
        { name: "Our Branches", href: "/branches" },
        { name: "Skin Education", href: "/skin-education" },
    ],
};

const socialLinks = [
    { name: "Instagram", icon: FaInstagram, href: "https://www.instagram.com/naya_glows?stkn=MWlyM2hkY2l6enE3eA==" },
    { name: "TikTok", icon: FaTiktok, href: "https://www.tiktok.com/@nayaglows?_r=1&_t=ZS-99mgJVVKDuX" },
    { name: "Facebook", icon: FaFacebookF, href: "https://www.facebook.com/share/1HyVJ16yh8/?mibextid=wwXIfr" },
    { name: "WhatsApp", icon: FaWhatsapp, href: "https://wa.me/message/EAUMKMUXZKODN1" },
    { name: "Twitter", icon: FaTwitter, href: "https://twitter.com" },
    { name: "Youtube", icon: FaYoutube, href: "https://youtube.com" },
];

const benefits = [
    { icon: Leaf, text: "Clean Ingredients" },
    { icon: Droplets, text: "Cruelty-Free" },
    { icon: Shield, text: "Dermatologist Tested" },
    { icon: Sparkles, text: "Made in Nigeria" },
];

export default function Footer() {
    const pathname = usePathname();
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeNewsletter, { isLoading: subscribing }] = useSubscribeNewsletterMutation();

    const handleSubscribe = async (e: FormEvent) => {
        e.preventDefault();
        if (!isApiConfigured()) {
            toast.error("Newsletter signup isn't connected yet (NEXT_PUBLIC_API_URL isn't set).");
            return;
        }
        try {
            await subscribeNewsletter({ email: newsletterEmail }).unwrap();
            setSubscribed(true);
            setNewsletterEmail("");
            setTimeout(() => setSubscribed(false), 4000);
        } catch (err) {
            toast.error(getApiErrorMessage(err, "Couldn't subscribe. Please try again."));
        }
    };

    return (
        <footer className="relative bg-black text-white/70 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-[#c9a87c] rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-[#8b7355] rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000" />
            </div>

            {/* Main footer content */}
            <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 pb-8">
                {/* Benefits strip */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 pb-8 border-b border-white/10">
                    {benefits.map((benefit, idx) => {
                        const Icon = benefit.icon;
                        return (
                            <div
                                key={idx}
                                className="flex items-center justify-center gap-3 text-white/60 group hover:text-white/90 transition-all duration-300"
                            >
                                <Icon
                                    size={20}
                                    className="text-[#c9a87c] group-hover:scale-110 transition-transform duration-300"
                                />
                                <span className="text-sm font-medium tracking-wide">
                                    {benefit.text}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
                    {/* Brand column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                                <Image
                                    src="https://res.cloudinary.com/bhozkz7o/image/upload/v1784381892/naya-glows/legacy/naya-logo.png"
                                    alt="Naya Glows"
                                    width={42}
                                    height={42}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-white font-semibold text-xl tracking-tight">
                                NAYA GLOWS
                            </span>
                        </div>
                        <p className="text-white/50 text-sm leading-relaxed max-w-md">
                            Radiance-boosting skincare crafted with clean, potent ingredients.
                            Illuminate your natural glow, one drop at a time.
                        </p>
                        {/* Newsletter */}
                        <div className="space-y-3">
                            <p className="text-white/80 text-sm font-medium tracking-wide">
                                Join the glow
                            </p>
                            <form className="flex" onSubmit={handleSubscribe}>
                                <input
                                    type="email"
                                    required
                                    value={newsletterEmail}
                                    onChange={(e) => setNewsletterEmail(e.target.value)}
                                    placeholder="Your email address"
                                    className="flex-1 bg-white/5 border border-white/10 rounded-l-full px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a87c]/50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={subscribing}
                                    className="bg-[#c9a87c] text-black px-5 rounded-r-full hover:bg-[#d4b88c] transition-all duration-300 flex items-center gap-2 group disabled:opacity-60"
                                >
                                    <span className="text-sm font-medium hidden sm:inline">
                                        {subscribed ? "Subscribed" : subscribing ? "Joining…" : "Subscribe"}
                                    </span>
                                    {subscribed ? (
                                        <Check size={16} />
                                    ) : (
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    )}
                                </button>
                            </form>
                            <p className="text-white/30 text-xs">
                                10% off your first order • No spam, just radiance
                            </p>
                        </div>
                    </div>

                    {/* Links columns */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title} className="space-y-4">
                            <h3 className="text-white font-semibold text-sm tracking-[0.2em] uppercase">
                                {title}
                            </h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            className={`text-white/50 hover:text-[#c9a87c] text-sm transition-all duration-200 inline-block group ${pathname === link.href ? "text-[#c9a87c]" : ""
                                                }`}
                                        >
                                            <span className="group-hover:translate-x-1 inline-block transition-transform duration-200">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="mt-16 pt-8 border-t border-white/10">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
                        {/* Contact info */}
                        <div className="flex flex-wrap justify-center gap-6 text-white/40 text-xs">
                            <div className="flex items-center gap-2">
                                <Mail size={14} />
                                <span>hello@nayaglows.com</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone size={14} />
                                <span>+234 701 523 9681</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin size={14} />
                                <span>Lagos, Nigeria</span>
                            </div>
                        </div>

                        {/* Social links */}
                        <div className="flex gap-4">
                            {socialLinks.map((social) => {
                                const Icon = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#c9a87c] text-white/50 hover:text-black flex items-center justify-center transition-all duration-300 group"
                                        aria-label={social.name}
                                    >
                                        <Icon
                                            size={16}
                                            className="group-hover:scale-110 transition-transform"
                                        />
                                    </a>
                                );
                            })}
                        </div>

                        {/* Copyright */}
                        <div className="text-white/30 text-xs text-center">
                            © 2024 NAYA GLOWS. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-[#c9a87c]/5 to-transparent rounded-full pointer-events-none" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-to-bl from-[#c9a87c]/3 to-transparent rounded-full pointer-events-none" />
        </footer>
    );
}