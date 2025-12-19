import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Icon from '@/components/ui/icon';

export default function Index() {
  const [activeSection, setActiveSection] = useState('home');
  const [diamondAmount, setDiamondAmount] = useState(64);
  const [loanPeriod, setLoanPeriod] = useState(7);

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
            <div className="flex gap-6">
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
                  <Input placeholder="Твой никнейм в Minecraft" className="text-lg p-6 border-2" />
                  <Input placeholder="Твой Telegram (@username)" className="text-lg p-6 border-2" />
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xl py-6 font-black uppercase tracking-wide">
                    <Icon name="Rocket" className="mr-2" size={24} />
                    ОФОРМИТЬ ЗАЯВКУ
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
    </div>
  );
}