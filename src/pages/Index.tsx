import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [diamondAmount, setDiamondAmount] = useState(64);
  const [loanPeriod, setLoanPeriod] = useState(7);
  const [minecraftNickname, setMinecraftNickname] = useState('');
  const [telegramUsername, setTelegramUsername] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoadingApplications, setIsLoadingApplications] = useState(false);
  const { toast } = useToast();

  const calculateLoan = () => {
    const interest = 0.15;
    const totalReturn = Math.round(diamondAmount * (1 + interest * (loanPeriod / 7)));
    return { totalReturn, interest: totalReturn - diamondAmount };
  };

  const loan = calculateLoan();

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitApplication = async () => {
    if (!minecraftNickname || !telegramUsername) {
      toast({
        title: 'Ошибка',
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('https://functions.poehali.dev/b962861c-ec3e-4fe6-af95-0a6529ddf911', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          minecraftNickname,
          telegramUsername,
          diamondAmount,
          loanPeriod,
          totalReturn: loan.totalReturn,
          interest: loan.interest,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast({
          title: '✅ Заявка оформлена!',
          description: 'Ждите ответа, вам напишут в Telegram',
        });
        setMinecraftNickname('');
        setTelegramUsername('');
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить заявку',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отправить заявку',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminPassword) {
      toast({
        title: 'Ошибка',
        description: 'Введите пароль',
        variant: 'destructive',
      });
      return;
    }

    setIsLoadingApplications(true);
    try {
      const response = await fetch('https://functions.poehali.dev/7ca27fbb-9921-46b2-86c0-4e782350bc46', {
        method: 'GET',
        headers: {
          'X-Admin-Password': adminPassword,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setApplications(data.applications || []);
        toast({
          title: 'Успешно',
          description: `Загружено ${data.applications?.length || 0} заявок`,
        });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Неверный пароль',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить заявки',
        variant: 'destructive',
      });
    } finally {
      setIsLoadingApplications(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute top-1/4 left-0 w-full h-1 bg-primary blur-sm animate-slide-left" style={{ animationDelay: '0s' }} />
        <div className="absolute top-2/4 left-0 w-full h-1 bg-secondary blur-sm animate-slide-left" style={{ animationDelay: '1s' }} />
        <div className="absolute top-3/4 left-0 w-full h-1 bg-accent blur-sm animate-slide-left" style={{ animationDelay: '2s' }} />
      </div>

      <nav className="fixed top-0 w-full bg-card/90 backdrop-blur-md border-b-4 border-primary z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary flex items-center justify-center text-2xl">💎</div>
              <span className="text-2xl font-bold tracking-wider glow-red">BLACKROCK</span>
            </div>
            <div className="flex gap-6 items-center">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'credits', label: 'Кредиты', icon: 'Gem' },
                { id: 'faq', label: 'FAQ', icon: 'HelpCircle' },
                { id: 'about', label: 'О нас', icon: 'Users' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-2 text-sm font-semibold uppercase tracking-wide transition-all hover:text-primary ${
                    activeSection === item.id ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <Icon name={item.icon as any} size={18} />
                  {item.label}
                </button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdminPanel(true)}
                className="ml-4 border-2 font-bold uppercase"
              >
                <Icon name="Lock" className="mr-2" size={16} />
                Админ
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <section id="home" className="min-h-screen flex items-center justify-center relative pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            <div className="inline-block px-6 py-2 bg-primary/20 border-2 border-primary text-primary font-bold uppercase text-sm mb-4">
              ⚡ Быстрый фарм × Нет ограничений
            </div>
            <h1 className="text-6xl md:text-8xl font-black leading-none glow-red mb-6">
              НАКОПИЛ НА МЕЧ?<br />
              <span className="text-secondary glow-blue">ВОЗЬМИ КРЕДИТ</span><br />
              НА БРОНЮ!
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Виртуальные кредиты на алмазные блоки. Затарься за секунды, верни когда захочешь.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => scrollToSection('credits')}
                className="bg-primary hover:bg-primary/90 text-white text-lg px-8 py-6 font-bold uppercase tracking-wide animate-pulse"
                size="lg"
              >
                <Icon name="Zap" className="mr-2" size={24} />
                Получить кредит
              </Button>
              <Button
                variant="outline"
                onClick={() => scrollToSection('about')}
                className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white text-lg px-8 py-6 font-bold uppercase tracking-wide"
                size="lg"
              >
                Как работает
              </Button>
            </div>

          </div>
        </div>
      </section>

      <section id="credits" className="min-h-screen flex items-center justify-center py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black glow-red mb-4">КАЛЬКУЛЯТОР КРЕДИТА</h2>
            <p className="text-xl text-muted-foreground">Узнай условия за 10 секунд</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="bg-card border-4 border-primary shadow-2xl animate-scale-in">
              <CardHeader>
                <CardTitle className="text-3xl font-black text-center flex items-center justify-center gap-3">
                  <span className="text-4xl">💎</span>
                  НАСТРОЙ СВОЙ КРЕДИТ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold uppercase">Количество алмазов</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={diamondAmount}
                        onChange={(e) => setDiamondAmount(Number(e.target.value))}
                        className="w-24 text-center font-bold text-xl border-2 border-primary"
                      />
                      <span className="text-2xl">💎</span>
                    </div>
                  </div>
                  <Slider
                    value={[diamondAmount]}
                    onValueChange={(value) => setDiamondAmount(value[0])}
                    min={1}
                    max={256}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-lg font-bold uppercase">Срок возврата</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={loanPeriod}
                        onChange={(e) => setLoanPeriod(Number(e.target.value))}
                        className="w-24 text-center font-bold text-xl border-2 border-secondary"
                      />
                      <span className="text-lg font-bold text-muted-foreground">ДНЕЙ</span>
                    </div>
                  </div>
                  <Slider
                    value={[loanPeriod]}
                    onValueChange={(value) => setLoanPeriod(value[0])}
                    min={1}
                    max={30}
                    step={1}
                    className="cursor-pointer"
                  />
                </div>

                <div className="bg-muted p-6 rounded-lg space-y-3 border-l-4 border-accent">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Получаешь:</span>
                    <span className="font-bold text-2xl text-secondary flex items-center gap-2">
                      {diamondAmount} <span className="text-xl">💎</span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-muted-foreground">Проценты:</span>
                    <span className="font-bold text-xl text-accent">+{loan.interest} 💎</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-bold uppercase">Вернуть нужно:</span>
                    <span className="font-black text-3xl text-primary flex items-center gap-2">
                      {loan.totalReturn} <span className="text-2xl">💎</span>
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input 
                    placeholder="Твой никнейм в Minecraft" 
                    className="text-lg p-6 border-2"
                    value={minecraftNickname}
                    onChange={(e) => setMinecraftNickname(e.target.value)}
                  />
                  <Input 
                    placeholder="Твой Telegram (@username)" 
                    className="text-lg p-6 border-2"
                    value={telegramUsername}
                    onChange={(e) => setTelegramUsername(e.target.value)}
                  />
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white text-xl py-6 font-black uppercase tracking-wide"
                    onClick={handleSubmitApplication}
                    disabled={isSubmitting}
                  >
                    <Icon name="Rocket" className="mr-2" size={24} />
                    {isSubmitting ? 'ОТПРАВКА...' : 'ОФОРМИТЬ ЗАЯВКУ'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="faq" className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black glow-blue mb-4">ЧАСТЫЕ ВОПРОСЫ</h2>
            <p className="text-xl text-muted-foreground">Всё что нужно знать перед стартом</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: 'Как быстро получу алмазы?',
                  a: 'После оформления заявки вам напишут в Telegram, где сообщат когда алмазы будут готовы или причину отказа.',
                },
                {
                  q: 'Что если не смогу вернуть вовремя?',
                  a: 'Пиши в поддержку до дедлайна — продлим срок. Просрочка = +10% к сумме за каждый день.',
                },
                {
                  q: 'Можно взять несколько кредитов?',
                  a: 'Да, но только после возврата предыдущего. Проверенным игрокам (10+ возвратов) разрешаем до 3 активных кредитов.',
                },
                {
                  q: 'Как вернуть кредит?',
                  a: 'Отправляйся в банк на торговой зоне, сложи алмазы в сундуки и отправь скриншот о возврате долга в Telegram человеку, который писал тебе.',
                },
              ].map((item, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-card border-2 border-border px-6 rounded-lg"
                >
                  <AccordionTrigger className="text-lg font-bold uppercase hover:text-primary">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="about" className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-black glow-red mb-4">О НАС</h2>
            <p className="text-xl text-muted-foreground">Кто мы и почему мы лучшие</p>
          </div>
          <div className="max-w-4xl mx-auto space-y-12">
            <Card className="bg-card border-4 border-secondary">
              <CardContent className="p-8">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  Мы — команда игроков сервера "Шлакоблок". Создали этот сервис, чтобы помочь новичкам быстрее
                  прокачаться и получить доступ к нормальному снаряжению. Теперь любой может взять кредит на алмазы,
                  развиться в игре и вернуть долг уже с хорошим лутом. Это честно, быстро и без скама.
                </p>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              {[
                { icon: '⚔️', name: 'Fbi_Truck', role: 'Основатель', desc: 'Главный по кредитам' },
                { icon: '🛡️', name: 'Diss_Laferro', role: 'Техдир', desc: 'Код & автоматизация' },
              ].map((member) => (
                <Card key={member.name} className="bg-card border-2 border-border text-center hover:border-primary transition-all">
                  <CardContent className="p-6 space-y-3">
                    <div className="text-6xl">{member.icon}</div>
                    <h3 className="text-2xl font-black">{member.name}</h3>
                    <p className="text-primary font-bold uppercase text-sm">{member.role}</p>
                    <p className="text-muted-foreground text-sm">{member.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary">
              <CardContent className="p-8 text-center space-y-4">
                <h3 className="text-3xl font-black uppercase">Связаться с нами</h3>
                <div className="flex justify-center">
                  <Button 
                    variant="outline" 
                    className="border-2 font-bold uppercase"
                    onClick={() => window.open('https://t.me/FBi_truck', '_blank')}
                  >
                    <Icon name="Send" className="mr-2" />
                    Telegram
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-card border-t-4 border-primary py-8">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-2xl font-black">
            <span className="text-3xl">💎</span>
            <span className="glow-red">BLACKROCK</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © 2024 BlackRock. Виртуальный сервис кредитов для сервера "Шлакоблок". Играй умнее, не медленнее.
          </p>
        </div>
      </footer>

      <Dialog open={showAdminPanel} onOpenChange={setShowAdminPanel}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase">Панель администратора</DialogTitle>
          </DialogHeader>
          
          {applications.length === 0 ? (
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="Введите пароль администратора"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="text-lg p-4"
              />
              <Button
                onClick={handleAdminLogin}
                disabled={isLoadingApplications}
                className="w-full bg-primary hover:bg-primary/90 text-white font-bold uppercase"
              >
                {isLoadingApplications ? 'Загрузка...' : 'Войти'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Заявки: {applications.length}</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setApplications([]);
                    setAdminPassword('');
                  }}
                >
                  Выйти
                </Button>
              </div>
              
              <div className="space-y-3">
                {applications.map((app) => (
                  <Card key={app.id} className="bg-card border-2">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Никнейм:</p>
                          <p className="font-bold text-lg">{app.minecraftNickname}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Telegram:</p>
                          <p className="font-bold text-lg">{app.telegramUsername}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Алмазов:</p>
                          <p className="font-bold text-primary">{app.diamondAmount} 💎</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Срок:</p>
                          <p className="font-bold">{app.loanPeriodDays} дней</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Вернуть:</p>
                          <p className="font-bold text-accent">{app.totalReturnAmount} 💎</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Дата:</p>
                          <p className="font-bold">{new Date(app.createdAt).toLocaleString('ru-RU')}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}