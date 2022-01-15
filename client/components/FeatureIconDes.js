const FeaturIconDes = ({ description, icon }) => {
    return (
        <div className="flex flex-col items-center gap-y-2">
            <img src={icon?.src} className="demo-icons bg-gray-400 rounded-full" />
            <div className="bg-white -skew-x-12 p-2">
                <h2 className="text-xl font-bold">{description}</h2>
            </div>
        </div>
    )
}

export default FeaturIconDes;