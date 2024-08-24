import ListIcon from '@mui/icons-material/List';

export function Header() {
    return (<><div className="bg-cyan-600 px-4 py-2">
        <div className="w-full h-full flex items-center">
            <div className="flex items-center justify-center cursor-pointer p-1 text-white hover:text-stone-300" title="Список запросов">
                <ListIcon />
            </div>
        </div>
    </div></>)
}