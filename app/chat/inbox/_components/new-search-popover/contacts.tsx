import type { UserType } from "@/types/base";
import { cn } from "@/lib/utils";
import Avatar from "@/components/shared/avatar";

interface ContactsProps {
  contacts: UserType[];
  handleCreateChat: (user: UserType) => Promise<void>;
  setIsPopoverOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const groupContacts = (contacts: UserType[]) => {
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));

  // Group contacts by their initial letters
  const result = sortedContacts.reduce((acc, contact) => {
    const firstLetter = contact.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(contact);
    return acc;
  }, {} as Record<string, UserType[]>);

  return result;
};

const Contacts: React.FC<ContactsProps> = ({
  contacts,
  handleCreateChat,
  setIsPopoverOpen,
}) => {
  const groupedContacts = groupContacts(contacts);

  const handleContactClick = async (contact: UserType) => {
    setIsPopoverOpen(false);

    // If user previously deleted chat, call this method to remove the hide field from the chat
    await handleCreateChat(contact);
  };

  return (
    <div>
      <p className="font-bold mb-2 text-text">Contacts</p>

      <div className="flex flex-col gap-4">
        {Object.keys(groupedContacts)
          .sort()
          .map((letter, index) => (
            <div key={`${letter}-${index}`} className="flex flex-col gap-2">
              <h2 className="font-semibold py-2 text-text-muted sticky top-0 bg-gray-300">
                {letter}
              </h2>
              <div className="rounded-sm overflow-hidden">
                {groupedContacts[letter].map((contact) => (
                  <div
                    key={`${contact.id}-${index}`}
                    onClick={() => handleContactClick(contact)}
                    className={cn(
                      "bg-gray-200 border-b border-b-gray-100 p-2 cursor-pointer flex gap-2 items-center",
                      {
                        "rounded-t-md": index === 0,
                        "rounded-b-md":
                          index === groupedContacts[letter].length - 1,
                      }
                    )}
                  >
                    <Avatar
                      src={contact.avatar_url}
                      classNames={{ avatar: "w-12 h-12" }}
                    />
                    <p className="text-sm font-semibold">{contact.name}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Contacts;
