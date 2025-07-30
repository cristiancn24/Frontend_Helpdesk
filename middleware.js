import { NextResponse } from 'next/server'

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value

  // Lista de rutas protegidas
  const protectedPaths = [
    '/dashboard',
    '/tickets',
    '/tickets-supervisor',
    '/settings',
    '/auth',
    '/pool'
  ]

  const { pathname } = request.nextUrl
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtected && !token) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
