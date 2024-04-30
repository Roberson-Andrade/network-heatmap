import { FormEvent, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./components/ui/table";
import { useToast } from "./components/ui/use-toast";

interface Room {
  signalLevel24: string;
  room: string;
  signalLevel5: string;
  speed24: string;
  speed5: string;
  interference: string;
}

const FIELDS_LABEL: Record<keyof Room, string> = {
  room: "Cômodo",
  signalLevel24: "Nível de sinal (dbm) 2,4GHz",
  signalLevel5: "Nível de sinal (dbm) 5GHz",
  speed24: "Velocidade (Mbps) 2,4GHz",
  speed5: "Velocidade (Mbps) 5GHz",
  interference: "Interferência",
};

const NOT_REQUIRED_FIELDS = new Set(["interference"]);

export function App() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);

  const { toast } = useToast();
  function onSubmit(event: FormEvent) {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const missingFields: string[] = [];

    for (const [field, value] of formData.entries()) {
      if (!value && !NOT_REQUIRED_FIELDS.has(field)) {
        missingFields.push(FIELDS_LABEL[field as keyof typeof FIELDS_LABEL]);
      }
    }

    if (missingFields.length > 0) {
      toast({
        title: "Preencha todos os campos",
        description: `Campos faltando: ${missingFields.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    const newRoom = Object.fromEntries(formData.entries()) as unknown as Room;

    setRooms([...rooms, newRoom]);
    setOpen(false);
  }
  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <section className="w-full max-w-5xl px-4 flex flex-col gap-2">
        <div className="w-full flex justify-end items-center">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>Adicionar cômodo</Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <form id="room-form" onSubmit={onSubmit}>
                  <DialogTitle>Adicionar cômodo</DialogTitle>
                  <DialogDescription>
                    Adicione as informações dos sinais de rede para um
                    determinado cômodo
                  </DialogDescription>

                  <div className="grid grid-cols-12 py-4 gap-4">
                    <div className="flex flex-col gap-1 col-span-12">
                      <Label htmlFor="room">Cômodo</Label>
                      <Input
                        id="room"
                        name="room"
                        placeholder="Ex: sala de estar"
                      />
                    </div>

                    <div className="flex flex-col gap-1 col-span-6">
                      <Label htmlFor="room">Nível de sinal (dbm)</Label>
                      <div className="flex gap-2">
                        <Input
                          name="signalLevel24"
                          id="signalLevel24"
                          placeholder="2,4GHz"
                          type="number"
                        />
                        <Input
                          name="signalLevel5"
                          id="signalLevel5"
                          placeholder="5GHz"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 col-span-6">
                      <Label htmlFor="room">Velocidade (Mbps)</Label>
                      <div className="flex gap-2">
                        <Input
                          name="speed24"
                          id="speed24"
                          placeholder="2,4GHz"
                          type="number"
                        />
                        <Input
                          name="speed5"
                          id="speed5"
                          placeholder="5GHz"
                          type="number"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 col-span-12">
                      <Label htmlFor="interference">Interferência</Label>
                      <Input name="interference" id="interference" />
                    </div>
                  </div>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DialogClose>

                    <Button type="submit">Salvar</Button>
                  </DialogFooter>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="border rounded-md">
          <Table className="h-[50vh]">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Cômodo</TableHead>
                <TableHead>Nível de sinal (dbm) 2,4GHz</TableHead>
                <TableHead>Nível de sinal (dbm) 5GHz</TableHead>
                <TableHead>Velocidade (Mbps) 2,4GHz</TableHead>
                <TableHead>Velocidade (Mbps) 5GHz</TableHead>
                <TableHead>Interferência</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.room}>
                  <TableCell className="font-medium">{room.room}</TableCell>
                  <TableCell>{room.signalLevel24}</TableCell>
                  <TableCell>{room.signalLevel5}</TableCell>
                  <TableCell>{room.speed24}</TableCell>
                  <TableCell>{room.speed5}</TableCell>
                  <TableCell>{room.interference}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}
