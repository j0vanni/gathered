import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import api from "@/globals";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface User {
  id: string;
  name: string;
  email: string;
  photo: string;
}

function ListTitle({
  title,
  users,
  listId,
  getLists,
}: {
  title: string;
  users: User[];
  listId: string;
  getLists: () => void;
}) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(title);
  const [listTitle, setListTitle] = useState(title);
  const [, setAddUserOpen] = useState(false);
  const [addUserEmail, setAddUserEmail] = useState("");
  const handleCancel = () => {
    setName(title);
    setOpen(false);
    setAddUserOpen(false);
    setAddUserEmail("");
  };

  const handleRemoveUser = async (user: User) => {
    try {
      const response = await axios.post(
        `${api}/lists/removeUser`,
        { listId, userId: user.id },
        { withCredentials: true }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      await getLists();
      toast.success("User removed from list");
    } catch (error) {
      toast.error("Error removing user from list");
    }
  };

  const handleDeleteList = async () => {
    try {
      await axios.post(
        `${api}/lists/delete`,
        { listId },
        { withCredentials: true }
      );
      await getLists();
      toast.success("List deleted successfully");
    } catch (error) {
      toast.error("Error deleting list");
    }
  };

  const handleSubmitList = async () => {
    try {
      await axios.post(
        `${api}/lists/update`,
        { listId, name, users },
        { withCredentials: true }
      );
      setListTitle(name);
      setOpen(false);
      toast.success("List updated successfully");
    } catch (error) {
      console.error("Error updating list:", error);
      toast.error("Failed to update list");
    }
  };

  const handleAddUserToList = async () => {
    if (!addUserEmail) {
      toast.error("Please enter an email");
      return;
    }
    try {
      const response = await axios.post(
        `${api}/lists/addUser`,
        { userEmail: addUserEmail, listId },
        { withCredentials: true }
      );
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }
      await getLists();
      toast.success("User added to list");
    } catch (error) {
      toast.error("Error adding user to list");
    }
  };

  return (
    <>
      {!isMobile ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild className="mb-4 w-11/12">
            <Button variant="outline" className="w-64 truncate">
              {listTitle}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader className="flex flex-col items-center">
              <DialogTitle className="mt-2 mb-4">Edit List</DialogTitle>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Separator className="my-2 w-1/2" />
              <div className="text-sm font-bold text-center">Users in List</div>
              <ScrollArea className="w-[375px] whitespace-nowrap rounded-md">
                <div className="flex w-max space-x-2 p-2">
                  {users.map((item, index) => {
                    return (
                      <DropdownMenu key={index}>
                        <DropdownMenuTrigger asChild>
                          <Avatar>
                            <AvatarImage
                              src={`${item.photo}`}
                              referrerPolicy="no-referrer"
                            />
                            <AvatarFallback className="uppercase">
                              {item.name.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => handleRemoveUser(item)}
                          >
                            Remove from List
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    );
                  })}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex w-11/12 flex-col items-center justify-center">
                <h1>Add User</h1>
                <div className=" w-full flex-row flex">
                  <Input
                    placeholder="Enter user to add's email"
                    value={addUserEmail}
                    onChange={(e) => setAddUserEmail(e.target.value)}
                  />
                  <Button onClick={handleAddUserToList}>Add</Button>
                </div>
              </div>
            </DialogHeader>
            <DialogFooter className="mt-4">
              <Button variant="destructive" onClick={handleDeleteList}>
                Delete List
              </Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSubmitList}>Submit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="w-64 mb-4 truncate">
              {listTitle}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader className="flex flex-col items-center">
              <DrawerTitle className="mt-2 mb-4">Edit List</DrawerTitle>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Separator className="my-2 w-1/2" />
            </DrawerHeader>
            <div className="flex flex-col items-center">
              <div className="text-sm font-bold text-center">Users in List</div>
              <ScrollArea className="w-10/12 whitespace-nowrap rounded-md">
                <div className="flex w-full space-x-2 p-2">
                  {users.map((item) => (
                    <DropdownMenu key={item.id}>
                      <DropdownMenuTrigger asChild>
                        <Avatar>
                          <AvatarImage
                            src={`${item.photo}`}
                            referrerPolicy="no-referrer"
                          />
                          <AvatarFallback className="uppercase">
                            {item.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => handleRemoveUser(item)}
                        >
                          Remove from List
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              <div className="flex w-11/12 flex-col items-center justify-center">
                <h1>Add User</h1>
                <div className=" w-full flex-row flex">
                  <Input
                    placeholder="Enter user to add's email"
                    value={addUserEmail}
                    onChange={(e) => setAddUserEmail(e.target.value)}
                  />
                  <Button onClick={handleAddUserToList}>Add</Button>
                </div>
              </div>
            </div>
            <DrawerFooter className="pt-6">
              <Button variant="destructive" onClick={handleDeleteList}>
                Delete List
              </Button>

              <DrawerClose asChild>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button onClick={handleSubmitList}>Submit</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}

export default ListTitle;
