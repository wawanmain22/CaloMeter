import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link, usePage } from '@inertiajs/react';
import { User, LogOut, Menu } from 'lucide-react';
import { SharedData } from '@/types';
import { ThemeToggle } from '@/components/theme-toggle';

interface NavbarProps {
  showAuthButtons?: boolean;
}

export default function Navbar({ showAuthButtons = true }: NavbarProps) {
  const { auth } = usePage<SharedData>().props;
  const user = auth?.user;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CM</span>
              </div>
              <span className="font-bold text-xl text-foreground">CaloMeter</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/bmi" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              BMI Calculator
            </Link>
            <Link 
              href="/calorie-intake" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Calorie Intake
            </Link>
            <Link 
              href="/daily-tracker" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium"
            >
              Daily Tracker
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader>
                  <SheetTitle>Menu Navigasi</SheetTitle>
                  <SheetDescription>
                    Akses fitur-fitur CaloMeter dan kelola akun Anda
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col h-full">
                  <div className="flex-1 space-y-6 mt-6">
                    {/* Navigation Links */}
                    <div className="space-y-4">
                      <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Menu</h3>
                      <div className="space-y-3">
                        <SheetClose asChild>
                          <Link 
                            href="/bmi" 
                            className="flex items-center text-base font-medium hover:text-primary transition-colors py-1"
                          >
                            BMI Calculator
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            href="/calorie-intake" 
                            className="flex items-center text-base font-medium hover:text-primary transition-colors py-1"
                          >
                            Calorie Intake
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link 
                            href="/daily-tracker" 
                            className="flex items-center text-base font-medium hover:text-primary transition-colors py-1"
                          >
                            Daily Tracker
                          </Link>
                        </SheetClose>
                      </div>
                    </div>
                    
                    {/* Auth Section */}
                    {showAuthButtons && (
                      <div className="border-t pt-6">
                        {user ? (
                          <div className="space-y-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-primary text-primary-foreground">
                                  {typeof user.username === 'string' ? user.username.charAt(0).toUpperCase() : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{String(user.username)}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <SheetClose asChild>
                                <Button variant="ghost" asChild className="w-full justify-start">
                                  <Link href="/profile">
                                    <User className="mr-2 h-4 w-4" />
                                    Profile
                                  </Link>
                                </Button>
                              </SheetClose>
                              <SheetClose asChild>
                                <Button variant="ghost" asChild className="w-full justify-start">
                                  <Link href="/logout" method="post">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                  </Link>
                                </Button>
                              </SheetClose>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <SheetClose asChild>
                              <Button variant="outline" asChild className="w-full">
                                <Link href="/login">Sign In</Link>
                              </Button>
                            </SheetClose>
                            <SheetClose asChild>
                              <Button asChild className="w-full">
                                <Link href="/register">Sign Up</Link>
                              </Button>
                            </SheetClose>
                          </div>
                        )}
                        <div className="mt-4">
                          <ThemeToggle />
                        </div>
                      </div>
                    )}
                    
                    {/* Theme toggle for non-auth users */}
                    {!showAuthButtons && (
                      <div className="border-t pt-6">
                        <ThemeToggle />
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Auth Section */}
          {showAuthButtons && (
            <div className="hidden md:flex items-center space-x-2">
              {/* Theme Toggle */}
              <ThemeToggle />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {typeof user.username === 'string' ? user.username.charAt(0).toUpperCase() : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{String(user.username)}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
                        </p>
                      </div>
                    </div>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/logout" method="post" className="w-full cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2 ml-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col space-y-2">
            <Link 
              href="/bmi" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
            >
              BMI Calculator
            </Link>
            <Link 
              href="/calorie-intake" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
            >
              Calorie Intake
            </Link>
            <Link 
              href="/daily-tracker" 
              className="text-muted-foreground hover:text-foreground transition-colors font-medium py-2"
            >
              Daily Tracker
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}